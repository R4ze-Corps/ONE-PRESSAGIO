import "dotenv/config";
import { createReadStream, existsSync, promises as fs } from "node:fs";
import { extname, join, normalize, relative } from "node:path";
import { createServer } from "node:http";

import discordTokenHandler from "./api/discord-token.js";
import discordUsersHandler from "./api/discord-users.js";
import discordRolesHandler from "./api/discord-roles.js";
import discordChannelsHandler from "./api/discord-channels.js";
import discordConfigHandler from "./api/discord-config.js";
import discordNotifyHandler from "./api/discord-notify.js";
import eventParticipantsHandler from "./api/event-participants.js";
import eventsHandler from "./api/events.js";
import latestEventHandler from "./api/events/latest.js";
import shopProductsHandler from "./api/shop-products.js";
import siteSettingsHandler from "./api/site-settings.js";
import usersHandler from "./api/users.js";
import userCoinsHandler from "./api/users/coins.js";

const port = Number(process.env.PORT) || 3000;
const host = "127.0.0.1";
const root = process.cwd();

const apiRoutes = new Map([
  ["/api/discord-token", discordTokenHandler],
  ["/api/discord-users", discordUsersHandler],
  ["/api/discord-roles", discordRolesHandler],
  ["/api/discord-channels", discordChannelsHandler],
  ["/api/discord-config", discordConfigHandler],
  ["/api/discord-notify", discordNotifyHandler],
  ["/api/event-participants", eventParticipantsHandler],
  ["/api/events", eventsHandler],
  ["/api/events/latest", latestEventHandler],
  ["/api/shop-products", shopProductsHandler],
  ["/api/site-settings", siteSettingsHandler],
  ["/api/users", usersHandler],
  ["/api/users/coins", userCoinsHandler],
]);

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

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  if (pathname === "/") return join(root, "index.html");
  const cleanPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(root, cleanPath);
}

function isInsideRoot(filePath) {
  const fromRoot = relative(root, filePath);
  return !fromRoot || (!fromRoot.startsWith("..") && !normalize(fromRoot).startsWith(".."));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function addCorsHeaders(response, allow = "GET,POST,PATCH,DELETE,OPTIONS") {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", allow);
}

async function handleApi(request, response, pathname) {
  const handler = apiRoutes.get(pathname);
  addCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return true;
  }

  if (!handler) {
    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Rota nao encontrada" }));
    return true;
  }

  const url = new URL(request.url, `http://localhost:${port}`);
  request.query = Object.fromEntries(url.searchParams.entries());
  request.body = ["POST", "PATCH", "PUT", "DELETE"].includes(request.method)
    ? await readJson(request)
    : {};

  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (data) => {
    if (!response.headersSent) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    response.end(JSON.stringify(data));
  };

  await handler(request, response);
  return true;
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://localhost:${port}`).pathname;

  if (pathname.startsWith("/api/")) {
    await handleApi(request, response, pathname);
    return;
  }

  let filePath = resolvePath(request.url);

  if (!isInsideRoot(filePath) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Arquivo nao encontrado");
    return;
  }

  const fileStats = await fs.stat(filePath);
  if (fileStats.isDirectory()) {
    const indexPath = join(filePath, "index.html");
    filePath = isInsideRoot(indexPath) && existsSync(indexPath)
      ? indexPath
      : join(root, "index.html");
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache, no-store, must-revalidate",
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
