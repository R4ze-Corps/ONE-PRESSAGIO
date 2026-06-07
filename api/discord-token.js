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

    response.status(400).json({
      configured: false,
      error:
        "Configure DISCORD_BOT_TOKEN nas variaveis de ambiente da Vercel e faca um novo deploy.",
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
