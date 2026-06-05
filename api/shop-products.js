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

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
