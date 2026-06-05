import "dotenv/config";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";
import { MongoClient } from "mongodb";

const port = Number(process.env.PORT) || 3000;
const host = "127.0.0.1";
const root = process.cwd();
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "one_hub";
let mongoClient;
let mongoDb;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const cleanPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(root, cleanPath === "/" ? "index.html" : cleanPath);
}

async function getDb() {
  if (!mongoUri) throw new Error("MONGODB_URI nao configurada no .env");
  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    mongoDb = mongoClient.db(mongoDbName);
  }
  return mongoDb;
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function normalizeProduct(product) {
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

function normalizeEvent(event) {
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

async function handleApi(request, response, pathname) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return true;
  }

  try {
    const db = await getDb();

    if (pathname === "/api/shop-products" && request.method === "GET") {
      const products = await db
        .collection("shop_products")
        .find({ isActive: { $ne: false } })
        .sort({ createdAt: -1 })
        .toArray();
      sendJson(response, 200, products.map(normalizeProduct));
      return true;
    }

    if (pathname === "/api/shop-products" && request.method === "POST") {
      const body = await readJson(request);
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
      sendJson(response, 201, normalizeProduct({ ...product, _id: result.insertedId }));
      return true;
    }

    if (pathname === "/api/events/latest" && request.method === "GET") {
      const event = await db
        .collection("events")
        .find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(1)
        .next();
      sendJson(response, 200, event ? normalizeEvent(event) : null);
      return true;
    }

    if (pathname === "/api/events" && request.method === "POST") {
      const body = await readJson(request);
      const event = {
        title: body.title || "Novo evento ONE",
        mainDescription: body.mainDescription || "",
        detailDescription: body.detailDescription || "",
        bannerUrl: body.bannerUrl || "",
        eventTime: body.eventTime || "",
        location: body.location || "",
        reward: body.reward || "",
        status: "active",
        createdAt: new Date(),
      };
      const result = await db.collection("events").insertOne(event);
      sendJson(response, 201, normalizeEvent({ ...event, _id: result.insertedId }));
      return true;
    }

    return false;
  } catch (error) {
    sendJson(response, 500, { error: error.message });
    return true;
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://localhost:${port}`).pathname;
  if (pathname.startsWith("/api/")) {
    const handled = await handleApi(request, response, pathname);
    if (!handled) sendJson(response, 404, { error: "Rota nao encontrada" });
    return;
  }

  const filePath = resolvePath(request.url);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Arquivo nao encontrado");
    return;
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
});

server.on("error", (error) => {
  console.error(`Erro ao iniciar o ONE HUB: ${error.message}`);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`ONE HUB rodando em http://${host}:${port}`);
});
