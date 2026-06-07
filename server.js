import "dotenv/config";
import {
  createReadStream,
  existsSync,
  promises as fs,
} from "node:fs";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";
import { MongoClient, ObjectId } from "mongodb";

const port = Number(process.env.PORT) || 3000;
const host = "127.0.0.1";
const root = process.cwd();
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "one_hub";
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID || "1500607972605296713";
const dataFile = join(root, "data.json");
let mongoClient;
let mongoDb;
let useJsonFallback = !mongoUri;

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

function createEmptyData() {
  return {
    shop_products: [],
    events: [],
    event_participants: [],
    users: [],
    settings: {},
  };
}

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const cleanPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(root, cleanPath === "/" ? "index.html" : cleanPath);
}

async function getDb() {
  if (useJsonFallback) return null;
  if (!mongoClient) {
    try {
      mongoClient = new MongoClient(mongoUri);
      await mongoClient.connect();
      mongoDb = mongoClient.db(mongoDbName);
    } catch (error) {
      console.warn(`MongoDB indisponivel, usando data.json: ${error.message}`);
      useJsonFallback = true;
      return null;
    }
  }
  return mongoDb;
}

async function readDataFile() {
  if (!existsSync(dataFile)) {
    return createEmptyData();
  }
  const content = await fs.readFile(dataFile, "utf8");
  const data = content.trim() ? JSON.parse(content) : createEmptyData();
  if (!data.settings) data.settings = {};
  return data;
}

async function writeDataFile(data) {
  await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
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
    id: (product._id || product.id).toString(),
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
    id: (event._id || event.id).toString(),
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

function normalizeParticipant(participant) {
  return {
    id: (participant._id || participant.id).toString(),
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

function normalizeDiscordMember(member) {
  const user = member.user || {};
  const name = user.global_name || user.username || "Usuario Discord";
  return {
    id: user.id,
    username: name,
    discordUsername: user.username || name,
    avatarUrl: user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
      : "",
    joinedAt: member.joined_at || null,
  };
}

function normalizeUser(user) {
  return {
    id: (user._id || user.id).toString(),
    username: user.username,
    provider: user.provider || "local",
    discordId: user.discordId || "",
    avatarUrl: user.avatarUrl || "",
    coins: Number(user.coins) || 0,
    createdAt: user.createdAt,
  };
}

async function getLocalDiscordBotToken() {
  if (discordBotToken) return discordBotToken;
  const data = await readDataFile();
  return data.settings?.discordBotToken || "";
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const candidate = pbkdf2Sync(password, salt, 120000, 32, "sha256");
  const saved = Buffer.from(hash, "hex");
  return saved.length === candidate.length && timingSafeEqual(saved, candidate);
}

async function handleApi(request, response, pathname) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return true;
  }

  try {
    const db = await getDb();

    if (pathname === "/api/shop-products" && request.method === "GET") {
      if (!db) {
        const data = await readDataFile();
        sendJson(
          response,
          200,
          data.shop_products
            .filter((product) => product.isActive !== false)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(normalizeProduct),
        );
        return true;
      }
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
      if (!db) {
        const data = await readDataFile();
        const localProduct = { ...product, id: createLocalId() };
        data.shop_products.unshift(localProduct);
        await writeDataFile(data);
        sendJson(response, 201, normalizeProduct(localProduct));
        return true;
      }
      const result = await db.collection("shop_products").insertOne(product);
      sendJson(response, 201, normalizeProduct({ ...product, _id: result.insertedId }));
      return true;
    }

    if (pathname === "/api/users" && request.method === "GET") {
      if (!db) {
        const data = await readDataFile();
        sendJson(response, 200, (data.users || []).map(normalizeUser));
        return true;
      }

      const users = await db
        .collection("users")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      sendJson(response, 200, users.map(normalizeUser));
      return true;
    }

    if (pathname === "/api/discord-users" && request.method === "GET") {
      const token = await getLocalDiscordBotToken();
      if (!token) {
        sendJson(response, 200, []);
        return true;
      }

      const discordResponse = await fetch(
        `https://discord.com/api/v10/guilds/${discordGuildId}/members?limit=1000`,
        {
          headers: {
            Authorization: `Bot ${token}`,
          },
        },
      );

      if (!discordResponse.ok) {
        sendJson(response, discordResponse.status, {
          error: "Nao foi possivel buscar membros do Discord.",
        });
        return true;
      }

      const members = await discordResponse.json();
      sendJson(response, 200, members.map(normalizeDiscordMember));
      return true;
    }

    if (pathname === "/api/discord-token" && request.method === "POST") {
      const body = await readJson(request);
      const token = String(body.token || "").trim();
      if (!token) {
        sendJson(response, 400, { error: "Token do bot obrigatorio." });
        return true;
      }

      const data = await readDataFile();
      data.settings = {
        ...(data.settings || {}),
        discordBotToken: token,
      };
      await writeDataFile(data);
      sendJson(response, 200, { saved: true });
      return true;
    }

    if (pathname === "/api/users" && request.method === "POST") {
      const body = await readJson(request);
      const action = body.action || "login";
      const username = String(body.username || "").trim();
      const password = String(body.password || "");

      const usernameKey = username.toLowerCase();

      if (action === "discord") {
        const discordId = String(body.discordId || "").trim();
        if (!discordId || !username) {
          sendJson(response, 400, { error: "Dados do Discord obrigatorios." });
          return true;
        }
        const now = new Date();

        if (!db) {
          const data = await readDataFile();
          if (!Array.isArray(data.users)) data.users = [];
          let user = data.users.find((item) => item.discordId === discordId);
          if (user) {
            Object.assign(user, {
              username,
              usernameKey,
              discordId,
              avatarUrl: body.avatarUrl || "",
              provider: "discord",
              lastLoginAt: now,
            });
          } else {
            user = {
              id: createLocalId(),
              username,
              usernameKey,
              discordId,
              avatarUrl: body.avatarUrl || "",
              provider: "discord",
              coins: 0,
              roles: [],
              createdAt: now,
              lastLoginAt: now,
            };
            data.users.unshift(user);
          }
          await writeDataFile(data);
          sendJson(response, 200, normalizeUser(user));
          return true;
        }

        const result = await db.collection("users").findOneAndUpdate(
          { discordId },
          {
            $set: {
              username,
              usernameKey,
              discordId,
              avatarUrl: body.avatarUrl || "",
              provider: "discord",
              lastLoginAt: now,
            },
            $setOnInsert: {
              coins: 0,
              roles: [],
              createdAt: now,
            },
          },
          { upsert: true, returnDocument: "after" },
        );
        sendJson(response, 200, normalizeUser(result));
        return true;
      }

      if (!username || !password) {
        sendJson(response, 400, { error: "Usuario e senha sao obrigatorios." });
        return true;
      }

      if (!db) {
        const data = await readDataFile();
        if (!Array.isArray(data.users)) data.users = [];
        const existing = data.users.find(
          (user) => user.usernameKey === usernameKey,
        );

        if (action === "signup") {
          if (existing) {
            sendJson(response, 409, { error: "Usuario ja existe." });
            return true;
          }
          const user = {
            id: createLocalId(),
            username,
            usernameKey,
            passwordHash: hashPassword(password),
            coins: 0,
            provider: "local",
            roles: [],
            createdAt: new Date(),
          };
          data.users.unshift(user);
          await writeDataFile(data);
          sendJson(response, 201, normalizeUser(user));
          return true;
        }

        if (!existing || !verifyPassword(password, existing.passwordHash)) {
          sendJson(response, 401, { error: "Usuario ou senha invalidos." });
          return true;
        }
        sendJson(response, 200, normalizeUser(existing));
        return true;
      }

      const users = db.collection("users");

      if (action === "signup") {
        const existing = await users.findOne({ usernameKey });
        if (existing) {
          sendJson(response, 409, { error: "Usuario ja existe." });
          return true;
        }
        const user = {
          username,
          usernameKey,
          passwordHash: hashPassword(password),
          coins: 0,
          provider: "local",
          roles: [],
          createdAt: new Date(),
        };
        const result = await users.insertOne(user);
        sendJson(response, 201, normalizeUser({ ...user, _id: result.insertedId }));
        return true;
      }

      const user = await users.findOne({ usernameKey });
      if (!user || !verifyPassword(password, user.passwordHash)) {
        sendJson(response, 401, { error: "Usuario ou senha invalidos." });
        return true;
      }
      sendJson(response, 200, normalizeUser(user));
      return true;
    }

    if (pathname === "/api/users/coins" && request.method === "POST") {
      const body = await readJson(request);
      const userId = body.userId;
      const delta = Number(body.delta) || 0;
      if (!userId) {
        sendJson(response, 400, { error: "ID do usuario obrigatorio." });
        return true;
      }

      if (!db) {
        const data = await readDataFile();
        const user = (data.users || []).find((item) => item.id === userId);
        if (!user) {
          sendJson(response, 404, { error: "Usuario nao encontrado." });
          return true;
        }
        user.coins = Math.max(0, (Number(user.coins) || 0) + delta);
        await writeDataFile(data);
        sendJson(response, 200, normalizeUser(user));
        return true;
      }

      const filter = ObjectId.isValid(userId)
        ? { _id: new ObjectId(userId) }
        : { id: userId };
      const user = await db.collection("users").findOne(filter);
      if (!user) {
        sendJson(response, 404, { error: "Usuario nao encontrado." });
        return true;
      }
      const nextCoins = Math.max(0, (Number(user.coins) || 0) + delta);
      await db.collection("users").updateOne(filter, {
        $set: { coins: nextCoins },
      });
      sendJson(response, 200, normalizeUser({ ...user, coins: nextCoins }));
      return true;
    }

    if (pathname === "/api/events" && request.method === "GET") {
      if (!db) {
        const data = await readDataFile();
        const events = data.events
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        sendJson(response, 200, events.map(normalizeEvent));
        return true;
      }
      const events = await db
        .collection("events")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      sendJson(response, 200, events.map(normalizeEvent));
      return true;
    }

    if (pathname === "/api/events/latest" && request.method === "GET") {
      if (!db) {
        const data = await readDataFile();
        const event = data.events
          .filter((item) => item.status === "active")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        sendJson(response, 200, event ? normalizeEvent(event) : null);
        return true;
      }
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
        status: body.status || "active",
        createdAt: new Date(),
      };
      if (!db) {
        const data = await readDataFile();
        const localEvent = { ...event, id: createLocalId() };
        data.events.unshift(localEvent);
        await writeDataFile(data);
        sendJson(response, 201, normalizeEvent(localEvent));
        return true;
      }
      const result = await db.collection("events").insertOne(event);
      sendJson(response, 201, normalizeEvent({ ...event, _id: result.insertedId }));
      return true;
    }

    if (pathname === "/api/events" && request.method === "PATCH") {
      const url = new URL(request.url, `http://localhost:${port}`);
      const body = await readJson(request);
      const eventId = url.searchParams.get("id") || body.id;
      if (!eventId) {
        sendJson(response, 400, { error: "ID do evento obrigatorio." });
        return true;
      }

      const allowedStatuses = ["active", "closed"];
      const updates = {};
      if (typeof body.title === "string") updates.title = body.title;
      if (typeof body.mainDescription === "string")
        updates.mainDescription = body.mainDescription;
      if (typeof body.detailDescription === "string")
        updates.detailDescription = body.detailDescription;
      if (typeof body.bannerUrl === "string") updates.bannerUrl = body.bannerUrl;
      if (typeof body.eventTime === "string") updates.eventTime = body.eventTime;
      if (typeof body.location === "string") updates.location = body.location;
      if (typeof body.reward === "string") updates.reward = body.reward;
      if (typeof body.status === "string") {
        if (!allowedStatuses.includes(body.status)) {
          sendJson(response, 400, { error: "Status do evento invalido." });
          return true;
        }
        updates.status = body.status;
      }

      if (!Object.keys(updates).length) {
        sendJson(response, 400, { error: "Nenhum campo para atualizar." });
        return true;
      }

      updates.updatedAt = new Date();

      if (!db) {
        const data = await readDataFile();
        const event = (data.events || []).find((item) => item.id === eventId);
        if (!event) {
          sendJson(response, 404, { error: "Evento nao encontrado." });
          return true;
        }
        Object.assign(event, updates);
        await writeDataFile(data);
        sendJson(response, 200, normalizeEvent(event));
        return true;
      }

      const eventFilter = ObjectId.isValid(eventId)
        ? { _id: new ObjectId(eventId) }
        : { id: eventId };
      const result = await db.collection("events").findOneAndUpdate(
        eventFilter,
        { $set: updates },
        { returnDocument: "after" },
      );
      if (!result) {
        sendJson(response, 404, { error: "Evento nao encontrado." });
        return true;
      }
      sendJson(response, 200, normalizeEvent(result));
      return true;
    }

    if (pathname === "/api/events" && request.method === "DELETE") {
      const url = new URL(request.url, `http://localhost:${port}`);
      const eventId = url.searchParams.get("id");
      if (!eventId) {
        sendJson(response, 400, { error: "ID do evento obrigatorio." });
        return true;
      }

      if (!db) {
        const data = await readDataFile();
        data.events = data.events.filter((event) => event.id !== eventId);
        data.event_participants = (data.event_participants || []).filter(
          (participant) => participant.eventId !== eventId,
        );
        await writeDataFile(data);
        sendJson(response, 200, { deleted: true });
        return true;
      }

      const eventFilter = ObjectId.isValid(eventId)
        ? { _id: new ObjectId(eventId) }
        : { id: eventId };
      const result = await db.collection("events").deleteOne(eventFilter);
      await db.collection("event_participants").deleteMany({ eventId });
      sendJson(response, 200, { deleted: result.deletedCount > 0 });
      return true;
    }

    if (pathname === "/api/event-participants" && request.method === "GET") {
      const url = new URL(request.url, `http://localhost:${port}`);
      const eventId = url.searchParams.get("eventId");
      if (!eventId) {
        sendJson(response, 400, { error: "ID do evento obrigatorio." });
        return true;
      }

      if (!db) {
        const data = await readDataFile();
        const participants = (data.event_participants || [])
          .filter(
            (participant) =>
              participant.eventId === eventId && participant.status === "joined",
          )
          .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
        sendJson(response, 200, participants.map(normalizeParticipant));
        return true;
      }

      const participants = await db
        .collection("event_participants")
        .find({ eventId, status: "joined" })
        .sort({ joinedAt: -1 })
        .toArray();
      sendJson(response, 200, participants.map(normalizeParticipant));
      return true;
    }

    if (pathname === "/api/event-participants" && request.method === "POST") {
      const body = await readJson(request);
      const now = new Date();
      const eventId = body.eventId || body.eventTitle || "evento-atual";
      const userId = body.userId || "anonymous";
      const joined = Boolean(body.joined);

      if (!db) {
        const data = await readDataFile();
        if (!Array.isArray(data.event_participants))
          data.event_participants = [];
        const existing = data.event_participants.find(
          (participant) =>
            participant.eventId === eventId && participant.userId === userId,
        );
        const participant = {
          ...(existing || { id: createLocalId(), joinedAt: now }),
          eventId,
          eventTitle: body.eventTitle || "",
          userId,
          username: body.username || "ONE HUB",
          avatarUrl: body.avatarUrl || "",
          status: joined ? "joined" : "left",
          leftAt: joined ? null : now,
          updatedAt: now,
        };
        if (existing) {
          Object.assign(existing, participant);
        } else {
          data.event_participants.unshift(participant);
        }
        await writeDataFile(data);
        sendJson(response, 200, normalizeParticipant(participant));
        return true;
      }

      const result = await db.collection("event_participants").findOneAndUpdate(
        { eventId, userId },
        {
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
          $setOnInsert: { joinedAt: now },
        },
        { upsert: true, returnDocument: "after" },
      );
      sendJson(response, 200, normalizeParticipant(result));
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

  let filePath = resolvePath(request.url);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Arquivo nao encontrado");
    return;
  }

  const fileStats = await fs.stat(filePath);
  if (fileStats.isDirectory()) {
    filePath = join(filePath, "index.html");
    if (!filePath.startsWith(root) || !existsSync(filePath)) {
      filePath = join(root, "index.html");
    }
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath)
    .on("error", () => {
      if (!response.headersSent) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      }
      response.end("Nao foi possivel carregar o arquivo");
    })
    .pipe(response);
});

server.on("error", (error) => {
  console.error(`Erro ao iniciar o ONE HUB: ${error.message}`);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`ONE HUB rodando em http://${host}:${port}`);
});
