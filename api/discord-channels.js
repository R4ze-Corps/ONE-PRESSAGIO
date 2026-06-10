import { getLocalDiscordBotToken } from "./_mongo.js";

const DISCORD_API = "https://discord.com/api/v10";

export default async function handler(request, response) {
  try {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const botToken = process.env.DISCORD_BOT_TOKEN || (await getLocalDiscordBotToken());
    const guildId = process.env.DISCORD_GUILD_ID || "1500607972605296713";

    if (!botToken) {
      response.status(200).json([]);
      return;
    }

    const discordResponse = await fetch(
      `${DISCORD_API}/guilds/${guildId}/channels`,
      { headers: { Authorization: `Bot ${botToken}` } },
    );

    if (!discordResponse.ok) {
      response.status(discordResponse.status).json({
        error: "Nao foi possivel buscar canais do Discord.",
      });
      return;
    }

    const channels = await discordResponse.json();
    const filtered = channels
      .filter(c => c.type === 0)
      .map(c => ({
        id: c.id,
        name: c.name,
        position: c.position || 0,
      }))
      .sort((a, b) => a.position - b.position);

    response.status(200).json(filtered);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
