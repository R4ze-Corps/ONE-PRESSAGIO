import { ObjectId } from "mongodb";
import { getDb, normalizeEvent } from "./_mongo.js";

export default async function handler(request, response) {
  try {
    const db = await getDb();

    if (request.method === "GET") {
      const events = await db
        .collection("events")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      response.status(200).json(events.map(normalizeEvent));
      return;
    }

    if (request.method === "POST") {
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
      return;
    }

    if (request.method === "DELETE") {
      const eventId = request.query?.id || request.body?.id;
      if (!eventId) {
        response.status(400).json({ error: "ID do evento obrigatorio." });
        return;
      }

      const eventFilter = ObjectId.isValid(eventId)
        ? { _id: new ObjectId(eventId) }
        : { id: eventId };
      const result = await db.collection("events").deleteOne(eventFilter);
      await db.collection("event_participants").deleteMany({ eventId });
      response.status(200).json({ deleted: result.deletedCount > 0 });
      return;
    }

    response.setHeader("Allow", "GET, POST, DELETE");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
