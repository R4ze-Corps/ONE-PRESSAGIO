import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "one_hub";

let cachedClient;
let cachedDb;

export async function getDb() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI nao configurada nas variaveis da Vercel.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(mongoUri);
    await cachedClient.connect();
    cachedDb = cachedClient.db(mongoDbName);
  }

  return cachedDb;
}

export function normalizeProduct(product) {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description || "",
    category: product.category || "fivem",
    rarity: product.rarity || "common",
    bannerUrl: product.bannerUrl || "",
    price: Number(product.price) || 0,
    quantity: Number(product.quantity) || 1,
    isActive: product.isActive !== false,
    createdAt: product.createdAt,
  };
}

export function normalizeEvent(event) {
  return {
    id: event._id.toString(),
    title: event.title,
    mainDescription: event.mainDescription,
    detailDescription: event.detailDescription || "",
    bannerUrl: event.bannerUrl || "",
    eventTime: event.eventTime || "",
    location: event.location || "",
    reward: event.reward || "",
    status: event.status || "active",
    createdAt: event.createdAt,
  };
}
