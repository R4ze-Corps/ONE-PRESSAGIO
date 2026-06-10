import { getLocalDiscordBotToken } from "./_mongo.js";

const DISCORD_API = "https://discord.com/api/v10";

export default async function handler(request, response) {
  try {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const botToken = process.env.DISCORD_BOT_TOKEN || (await getLocalDiscordBotToken());
    if (!botToken) {
      response.status(200).json({ sent: false, error: "Bot token nao configurado" });
      return;
    }

    const { userId, embeds } = request.body || {};
    if (!userId) {
      response.status(400).json({ error: "userId obrigatorio" });
      return;
    }

    // 1. Create DM channel
    const dmRes = await fetch(`${DISCORD_API}/users/${userId}/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: userId }),
    });

    if (!dmRes.ok) {
      const err = await dmRes.json().catch(() => ({}));
      response.status(200).json({ sent: false, error: err.message || "Falha ao criar DM" });
      return;
    }

    const dmChannel = await dmRes.json();
    const channelId = dmChannel.id;

    // 2. Send message with embed
    const msgPayload = embeds && embeds.length
      ? { embeds }
      : { content: "🔔 Novo evento disponivel no ONE HUB! Verifique o painel de eventos." };

    const msgRes = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msgPayload),
    });

    if (!msgRes.ok) {
      const err = await msgRes.json().catch(() => ({}));
      response.status(200).json({ sent: false, error: err.message || "Falha ao enviar mensagem" });
      return;
    }

    response.status(200).json({ sent: true });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
