import { getDb } from "./_mongo.js";

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

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const eventId = request.query?.eventId;
      if (!eventId) {
        response.status(400).json({ error: "ID do evento obrigatorio." });
        return;
      }

      const db = await getDb();
      const participants = await db
        .collection("event_participants")
        .find({ eventId, status: "joined" })
        .sort({ joinedAt: -1 })
        .toArray();
      response.status(200).json(participants.map(normalizeParticipant));
      return;
    }

    if (request.method !== "POST") {
      response.setHeader("Allow", "GET, POST");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const body = request.body || {};
    const db = await getDb();
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
      $setOnInsert: {
        joinedAt: now,
      },
    };

    const result = await db.collection("event_participants").findOneAndUpdate(
      { eventId, userId },
      update,
      { upsert: true, returnDocument: "after" },
    );

    response.status(200).json(normalizeParticipant(result));
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
