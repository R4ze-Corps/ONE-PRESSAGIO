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
      `${DISCORD_API}/guilds/${guildId}/roles`,
      { headers: { Authorization: `Bot ${botToken}` } },
    );

    if (!discordResponse.ok) {
      response.status(discordResponse.status).json({
        error: "Nao foi possivel buscar cargos do Discord.",
      });
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
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
