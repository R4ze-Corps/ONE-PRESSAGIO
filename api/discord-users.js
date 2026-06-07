const DISCORD_API = "https://discord.com/api/v10";

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

export default async function handler(request, response) {
  try {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID || "1500607972605296713";

    if (!botToken) {
      response.status(200).json([]);
      return;
    }

    const discordResponse = await fetch(
      `${DISCORD_API}/guilds/${guildId}/members?limit=1000`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      },
    );

    if (!discordResponse.ok) {
      response.status(discordResponse.status).json({
        error: "Nao foi possivel buscar membros do Discord.",
      });
      return;
    }

    const members = await discordResponse.json();
    response.status(200).json(members.map(normalizeDiscordMember));
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
