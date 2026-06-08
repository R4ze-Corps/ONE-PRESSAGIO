import { ObjectId } from "mongodb";
import { getDb, normalizeProduct } from "./_mongo.js";

export default async function handler(request, response) {
  try {
    const db = await getDb();

    if (request.method === "GET") {
      const products = await db
        .collection("shop_products")
        .find({ isActive: { $ne: false } })
        .sort({ createdAt: -1 })
        .toArray();

      response.status(200).json(products.map(normalizeProduct));
      return;
    }

    if (request.method === "POST") {
      const body = request.body || {};
      const product = {
        name: body.name || "Produto ONE",
        description: body.description || "",
        category: body.category || "fivem",
        rarity: body.rarity || "common",
        bannerUrl: body.bannerUrl || "",
        price: Math.max(0, Number(body.price) || 0),
        quantity: Math.max(1, Number(body.quantity) || 1),
        isActive: true,
        createdAt: new Date(),
      };

      const result = await db.collection("shop_products").insertOne(product);
      response
        .status(201)
        .json(normalizeProduct({ ...product, _id: result.insertedId }));
      return;
    }

    if (request.method === "PATCH") {
      const body = request.body || {};
      const productId = request.query?.id || body.id;
      if (!productId) {
        response.status(400).json({ error: "ID do produto obrigatorio." });
        return;
      }

      const updates = {};
      if (typeof body.name === "string") updates.name = body.name;
      if (typeof body.description === "string") updates.description = body.description;
      if (typeof body.category === "string") updates.category = body.category;
      if (typeof body.rarity === "string") updates.rarity = body.rarity;
      if (typeof body.bannerUrl === "string") updates.bannerUrl = body.bannerUrl;
      if (body.price !== undefined)
        updates.price = Math.max(0, Number(body.price) || 0);
      if (body.quantity !== undefined)
        updates.quantity = Math.max(1, Number(body.quantity) || 1);
      updates.updatedAt = new Date();

      const filter = ObjectId.isValid(productId)
        ? { _id: new ObjectId(productId) }
        : { id: productId };
      const result = await db
        .collection("shop_products")
        .findOneAndUpdate(filter, { $set: updates }, { returnDocument: "after" });

      if (!result) {
        response.status(404).json({ error: "Produto nao encontrado." });
        return;
      }

      response.status(200).json(normalizeProduct(result));
      return;
    }

    if (request.method === "DELETE") {
      const productId = request.query?.id || request.body?.id;
      if (!productId) {
        response.status(400).json({ error: "ID do produto obrigatorio." });
        return;
      }
      const filter = ObjectId.isValid(productId)
        ? { _id: new ObjectId(productId) }
        : { id: productId };
      const result = await db
        .collection("shop_products")
        .updateOne(filter, { $set: { isActive: false, updatedAt: new Date() } });
      response.status(200).json({ deleted: result.modifiedCount > 0 });
      return;
    }

    response.setHeader("Allow", "GET, POST, PATCH, DELETE");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
