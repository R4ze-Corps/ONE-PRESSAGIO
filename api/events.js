import { ObjectId } from "mongodb";
import { getDb, normalizeEvent } from "./_mongo.js";

function normalizeParticipant(participant) {
  return {
    id: participant._id?.toString(),
    eventId: participant.eventId,
    eventTitle: participant.eventTitle,
    userId: participant.userId,
    username: participant.username,
    avatarUrl: participant.avatarUrl || "",
    status: participant.status,
    joinedAt: participant.joinedAt,
    leftAt: participant.leftAt || null,
    updatedAt: participant.updatedAt,
  };
}

async function handleEventsGet(request, response, db) {
  const events = await db
    .collection("events")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  response.status(200).json(events.map(normalizeEvent));
}

async function handleEventsPost(request, response, db) {
  const body = request.body || {};
  const event = {
    title: body.title || "Novo evento ONE",
    mainDescription: body.mainDescription || "",
    detailDescription: body.detailDescription || "",
    bannerUrl: body.bannerUrl || "",
    eventTime: body.eventTime || "",
    location: body.location || "",
    reward: body.reward || "",
    status: body.status || "active",
    createdAt: new Date(),
  };

  const result = await db.collection("events").insertOne(event);
  response.status(201).json(normalizeEvent({ ...event, _id: result.insertedId }));
}

async function handleEventsPatch(request, response, db) {
  const body = request.body || {};
  const eventId = request.query?.id || body.id;
  if (!eventId) { response.status(400).json({ error: "ID do evento obrigatorio." }); return; }

  const allowedStatuses = ["active", "closed"];
  const eventFilter = ObjectId.isValid(eventId) ? { _id: new ObjectId(eventId) } : { id: eventId };
  const updates = {};

  if (typeof body.title === "string") updates.title = body.title;
  if (typeof body.mainDescription === "string") updates.mainDescription = body.mainDescription;
  if (typeof body.detailDescription === "string") updates.detailDescription = body.detailDescription;
  if (typeof body.bannerUrl === "string") updates.bannerUrl = body.bannerUrl;
  if (typeof body.eventTime === "string") updates.eventTime = body.eventTime;
  if (typeof body.location === "string") updates.location = body.location;
  if (typeof body.reward === "string") updates.reward = body.reward;
  if (typeof body.status === "string") {
    if (!allowedStatuses.includes(body.status)) { response.status(400).json({ error: "Status do evento invalido." }); return; }
    updates.status = body.status;
  }

  if (!Object.keys(updates).length) { response.status(400).json({ error: "Nenhum campo para atualizar." }); return; }
  updates.updatedAt = new Date();

  const result = await db.collection("events").findOneAndUpdate(
    eventFilter,
    { $set: updates },
    { returnDocument: "after" },
  );

  if (!result) { response.status(404).json({ error: "Evento nao encontrado." }); return; }
  response.status(200).json(normalizeEvent(result));
}

async function handleEventsDelete(request, response, db) {
  const eventId = request.query?.id || request.body?.id;
  if (!eventId) { response.status(400).json({ error: "ID do evento obrigatorio." }); return; }

  const eventFilter = ObjectId.isValid(eventId) ? { _id: new ObjectId(eventId) } : { id: eventId };
  const result = await db.collection("events").deleteOne(eventFilter);
  await db.collection("event_participants").deleteMany({ eventId });
  response.status(200).json({ deleted: result.deletedCount > 0 });
}

async function handleLatest(request, response, db) {
  const event = await db
    .collection("events")
    .find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();
  response.status(200).json(event ? normalizeEvent(event) : null);
}

async function handleParticipantsGet(request, response, db) {
  const eventId = request.query?.eventId;
  if (!eventId) { response.status(400).json({ error: "ID do evento obrigatorio." }); return; }

  const participants = await db
    .collection("event_participants")
    .find({ eventId, status: "joined" })
    .sort({ joinedAt: -1 })
    .toArray();
  response.status(200).json(participants.map(normalizeParticipant));
}

async function handleParticipantsPost(request, response, db) {
  const body = request.body || {};
  const now = new Date();
  const eventId = body.eventId || body.eventTitle || "evento-atual";
  const userId = body.userId || "anonymous";
  const joined = Boolean(body.joined);

  const update = {
    $set: {
      eventId,
      eventTitle: body.eventTitle || "",
      userId,
      username: body.username || "ONE HUB",
      avatarUrl: body.avatarUrl || "",
      status: joined ? "joined" : "left",
      updatedAt: now,
      ...(joined ? { leftAt: null } : { leftAt: now }),
    },
    $setOnInsert: { joinedAt: now },
  };

  const result = await db.collection("event_participants").findOneAndUpdate(
    { eventId, userId },
    update,
    { upsert: true, returnDocument: "after" },
  );

  response.status(200).json(normalizeParticipant(result));
}

export default async function handler(request, response) {
  try {
    const db = await getDb();
    const action = request.query?.action || "";

    if (request.method === "GET") {
      switch (action) {
        case "latest": return await handleLatest(request, response, db);
        case "participants": return await handleParticipantsGet(request, response, db);
        default: return await handleEventsGet(request, response, db);
      }
    }

    if (request.method === "POST") {
      switch (action) {
        case "participants": return await handleParticipantsPost(request, response, db);
        default: return await handleEventsPost(request, response, db);
      }
    }

    if (request.method === "PATCH") return await handleEventsPatch(request, response, db);
    if (request.method === "DELETE") return await handleEventsDelete(request, response, db);

    response.setHeader("Allow", "GET, POST, PATCH, DELETE");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
