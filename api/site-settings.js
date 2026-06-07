import { getDb } from "./_mongo.js";

function normalizeSetting(setting, key) {
  return {
    key,
    value: setting?.value ?? "default",
    updatedAt: setting?.updatedAt || null,
  };
}

export default async function handler(request, response) {
  try {
    const db = await getDb();

    if (request.method === "GET") {
      const key = request.query?.key || "globalTheme";
      const setting = await db.collection("site_settings").findOne({ key });
      response.status(200).json(normalizeSetting(setting, key));
      return;
    }

    if (request.method === "POST") {
      const body = request.body || {};
      const key = body.key || "globalTheme";
      const value = body.value || "default";
      const updatedAt = new Date();
      const result = await db.collection("site_settings").findOneAndUpdate(
        { key },
        { $set: { key, value, updatedAt } },
        { upsert: true, returnDocument: "after" },
      );
      response.status(200).json(normalizeSetting(result, key));
      return;
    }

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
