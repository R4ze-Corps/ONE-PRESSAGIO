import { ObjectId } from "mongodb";
import { getDb } from "../_mongo.js";

function publicUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    coins: Number(user.coins) || 0,
    createdAt: user.createdAt,
  };
}

export default async function handler(request, response) {
  try {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const body = request.body || {};
    const userId = body.userId;
    const delta = Number(body.delta) || 0;

    if (!userId) {
      response.status(400).json({ error: "ID do usuario obrigatorio." });
      return;
    }

    const db = await getDb();
    const filter = ObjectId.isValid(userId)
      ? { _id: new ObjectId(userId) }
      : { id: userId };
    const current = await db.collection("users").findOne(filter);
    if (!current) {
      response.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }

    const nextCoins = Math.max(0, (Number(current.coins) || 0) + delta);
    await db.collection("users").updateOne(filter, { $set: { coins: nextCoins } });
    response.status(200).json(publicUser({ ...current, coins: nextCoins }));
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
