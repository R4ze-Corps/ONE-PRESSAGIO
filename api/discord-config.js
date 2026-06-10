import { readDataFile, writeDataFile } from "./_mongo.js";

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const data = await readDataFile();
      const config = data.settings?.discordConfig || {};
      response.status(200).json(config);
      return;
    }

    if (request.method === "POST") {
      const { registroRoleId, aprovadoRoleId, geralRoleId, logChannelId } = request.body || {};
      const data = await readDataFile();
      data.settings = {
        ...(data.settings || {}),
        discordConfig: {
          registroRoleId: registroRoleId || "",
          aprovadoRoleId: aprovadoRoleId || "",
          geralRoleId: geralRoleId || "",
          logChannelId: logChannelId || "",
        },
      };
      await writeDataFile(data);
      response.status(200).json({ saved: true });
      return;
    }

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
