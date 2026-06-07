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

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
