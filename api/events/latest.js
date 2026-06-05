import { getDb, normalizeEvent } from "../_mongo.js";

export default async function handler(request, response) {
  try {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const db = await getDb();
    const event = await db
      .collection("events")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(1)
      .next();

    response.status(200).json(event ? normalizeEvent(event) : null);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
