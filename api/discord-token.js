import { saveLocalDiscordBotToken } from "./_mongo.js";

export default async function handler(request, response) {
  try {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.status(405).json({ error: "Metodo nao permitido" });
      return;
    }

    if (process.env.DISCORD_BOT_TOKEN) {
      response.status(200).json({
        configured: true,
        saved: false,
        message: "Token ja configurado nas variaveis de ambiente da Vercel.",
      });
      return;
    }

    const token = String(request.body?.token || "").trim();
    if (!token) {
      response.status(400).json({ error: "Token do bot obrigatorio." });
      return;
    }

    await saveLocalDiscordBotToken(token);
    response.status(200).json({
      configured: false,
      saved: true,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
