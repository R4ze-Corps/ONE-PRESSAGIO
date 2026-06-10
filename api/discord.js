import { getDb, getLocalDiscordBotToken, saveLocalDiscordBotToken, readDataFile, writeDataFile } from "./_mongo.js";

const DISCORD_API = "https://discord.com/api/v10";
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1500607972605296713";

async function getBotToken() {
  if (process.env.DISCORD_BOT_TOKEN) return process.env.DISCORD_BOT_TOKEN;
  try {
    const db = await getDb();
    const doc = await db.collection("site_settings").findOne({ key: "discordBotToken" });
    if (doc?.value) return doc.value;
  } catch (_) {}
  return getLocalDiscordBotToken();
}

async function loadDiscordConfig() {
  try {
    const db = await getDb();
    const doc = await db.collection("site_settings").findOne({ key: "discordConfig" });
    if (doc?.value) return doc.value;
  } catch (_) {}
  const data = await readDataFile();
  return data.settings?.discordConfig || {};
}

async function saveDiscordConfig(config) {
  try {
    const db = await getDb();
    await db.collection("site_settings").findOneAndUpdate(
      { key: "discordConfig" },
      { $set: { key: "discordConfig", value: config, updatedAt: new Date() } },
      { upsert: true },
    );
    return;
  } catch (_) {}
  const data = await readDataFile();
  data.settings = { ...(data.settings || {}), discordConfig: config };
  await writeDataFile(data);
}

async function saveToken(token) {
  try {
    const db = await getDb();
    await db.collection("site_settings").findOneAndUpdate(
      { key: "discordBotToken" },
      { $set: { key: "discordBotToken", value: token, updatedAt: new Date() } },
      { upsert: true },
    );
    return;
  } catch (_) {}
  await saveLocalDiscordBotToken(token);
}

async function handleRoles(request, response) {
  const botToken = await getBotToken();
  if (!botToken) { response.status(200).json([]); return; }

  const discordResponse = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/roles`, {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!discordResponse.ok) {
    response.status(discordResponse.status).json({ error: "Nao foi possivel buscar cargos do Discord." });
    return;
  }

  const roles = await discordResponse.json();
  const filtered = roles
    .filter(r => r.name !== "@everyone")
    .map(r => ({
      id: r.id,
      name: r.name,
      color: r.color ? `#${r.color.toString(16).padStart(6, "0")}` : null,
      position: r.position,
    }))
    .sort((a, b) => b.position - a.position);

  response.status(200).json(filtered);
}

async function handleChannels(request, response) {
  const botToken = await getBotToken();
  if (!botToken) { response.status(200).json([]); return; }

  const discordResponse = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/channels`, {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!discordResponse.ok) {
    response.status(discordResponse.status).json({ error: "Nao foi possivel buscar canais do Discord." });
    return;
  }

  const channels = await discordResponse.json();
  const filtered = channels
    .filter(c => c.type === 0)
    .map(c => ({ id: c.id, name: c.name, position: c.position || 0 }))
    .sort((a, b) => a.position - b.position);

  response.status(200).json(filtered);
}

async function handleUsers(request, response) {
  const botToken = await getBotToken();
  if (!botToken) { response.status(200).json([]); return; }

  const discordResponse = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/members?limit=1000`, {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!discordResponse.ok) {
    response.status(discordResponse.status).json({ error: "Nao foi possivel buscar membros do Discord." });
    return;
  }

  const members = await discordResponse.json();
  const normalized = members.map(member => {
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
  });

  response.status(200).json(normalized);
}

async function handleConfigGet(request, response) {
  const config = await loadDiscordConfig();
  response.status(200).json(config);
}

async function handleConfigPost(request, response) {
  const { registroRoleId, aprovadoRoleId, geralRoleId, logChannelId } = request.body || {};
  await saveDiscordConfig({
    registroRoleId: registroRoleId || "",
    aprovadoRoleId: aprovadoRoleId || "",
    geralRoleId: geralRoleId || "",
    logChannelId: logChannelId || "",
  });
  response.status(200).json({ saved: true });
}

async function handleNotify(request, response) {
  const botToken = await getBotToken();
  if (!botToken) { response.status(200).json({ sent: false, error: "Bot token nao configurado" }); return; }

  const { userId, embeds } = request.body || {};
  if (!userId) { response.status(400).json({ error: "userId obrigatorio" }); return; }

  const dmRes = await fetch(`${DISCORD_API}/users/${userId}/channels`, {
    method: "POST",
    headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ recipient_id: userId }),
  });
  if (!dmRes.ok) {
    const err = await dmRes.json().catch(() => ({}));
    response.status(200).json({ sent: false, error: err.message || "Falha ao criar DM" });
    return;
  }

  const dmChannel = await dmRes.json();
  const msgPayload = embeds?.length
    ? { embeds }
    : { content: "🔔 Novo evento disponivel no ONE HUB! Verifique o painel de eventos." };

  const msgRes = await fetch(`${DISCORD_API}/channels/${dmChannel.id}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(msgPayload),
  });

  if (!msgRes.ok) {
    const err = await msgRes.json().catch(() => ({}));
    response.status(200).json({ sent: false, error: err.message || "Falha ao enviar mensagem" });
    return;
  }

  response.status(200).json({ sent: true });
}

async function handleToken(request, response) {
  if (process.env.DISCORD_BOT_TOKEN) {
    response.status(200).json({ configured: true, saved: false, message: "Token ja configurado nas variaveis de ambiente da Vercel." });
    return;
  }

  const token = String(request.body?.token || "").trim();
  if (!token) { response.status(400).json({ error: "Token do bot obrigatorio." }); return; }

  await saveToken(token);
  response.status(200).json({ configured: false, saved: true });
}

export default async function handler(request, response) {
  try {
    const action = request.query?.action || "";

    if (request.method === "GET") {
      switch (action) {
        case "roles": return await handleRoles(request, response);
        case "channels": return await handleChannels(request, response);
        case "users": return await handleUsers(request, response);
        case "config": return await handleConfigGet(request, response);
        default:
          response.setHeader("Allow", "GET, POST");
          response.status(405).json({ error: `Acao '${action}' nao suportada para GET` });
      }
      return;
    }

    if (request.method === "POST") {
      switch (action) {
        case "config": return await handleConfigPost(request, response);
        case "notify": return await handleNotify(request, response);
        case "token": return await handleToken(request, response);
        default:
          response.setHeader("Allow", "GET, POST");
          response.status(405).json({ error: `Acao '${action}' nao suportada para POST` });
      }
      return;
    }

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
