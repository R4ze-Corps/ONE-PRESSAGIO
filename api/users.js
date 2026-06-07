import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { getDb } from "./_mongo.js";

function normalizeUsername(username) {
  return String(username || "").trim();
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    provider: user.provider || "local",
    discordId: user.discordId || "",
    avatarUrl: user.avatarUrl || "",
    coins: Number(user.coins) || 0,
    createdAt: user.createdAt,
  };
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

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const db = await getDb();
      const users = await db
        .collection("users")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      response.status(200).json(users.map(publicUser));
      return;
    }

    if (request.method !== "POST") {
      response.setHeader("Allow", "GET, POST");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const db = await getDb();
    const body = request.body || {};
    const action = body.action || "login";
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (action === "discord") {
      const discordId = String(body.discordId || "").trim();
      if (!discordId || !username) {
        response.status(400).json({ error: "Dados do Discord obrigatorios." });
        return;
      }

      const now = new Date();
      const result = await db.collection("users").findOneAndUpdate(
        { discordId },
        {
          $set: {
            username,
            usernameKey: username.toLowerCase(),
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
      response.status(200).json(publicUser(result));
      return;
    }

    if (!username || !password) {
      response.status(400).json({ error: "Usuario e senha sao obrigatorios." });
      return;
    }

    const usernameKey = username.toLowerCase();
    const users = db.collection("users");

    if (action === "signup") {
      const existing = await users.findOne({ usernameKey });
      if (existing) {
        response.status(409).json({ error: "Usuario ja existe." });
        return;
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
      response.status(201).json(publicUser({ ...user, _id: result.insertedId }));
      return;
    }

    const user = await users.findOne({ usernameKey });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      response.status(401).json({ error: "Usuario ou senha invalidos." });
      return;
    }

    response.status(200).json(publicUser(user));
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
