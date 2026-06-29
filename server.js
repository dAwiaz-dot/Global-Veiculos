const crypto = require("crypto");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const VEHICLES_FILE = path.join(DATA_DIR, "vehicles.json");
const PORT = Number(process.env.PORT) || 3000;
const ADMIN_USER = process.env.ADMIN_USER || "pedro";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "global123";
const MAX_BODY_BYTES = 35 * 1024 * 1024;
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

const sessions = new Map();

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const adminPages = new Set([
  "/admin.html",
  "/admin-cadastro.html",
  "/admin-financeiro.html",
  "/admin-meta.html",
  "/admin-publicacao.html",
]);

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf("=");
        if (index < 0) return [cookie, ""];
        return [decodeURIComponent(cookie.slice(0, index)), decodeURIComponent(cookie.slice(index + 1))];
      })
  );
}

function isAuthenticated(req) {
  const token = parseCookies(req).gv_session;
  const session = token && sessions.get(token);

  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

function sessionCookie(token) {
  return [
    `gv_session=${encodeURIComponent(token)}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ].join("; ");
}

function clearSessionCookie() {
  return "gv_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

async function readBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Payload muito grande");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonBody(req) {
  const body = await readBody(req);
  return body ? JSON.parse(body) : {};
}

async function readVehicles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(VEHICLES_FILE, "utf8");
    const vehicles = JSON.parse(content);
    return Array.isArray(vehicles) ? vehicles : [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Nao foi possivel ler o estoque.", error);
    }
    return [];
  }
}

async function writeVehicles(vehicles) {
  if (!Array.isArray(vehicles)) {
    const error = new Error("Estoque invalido");
    error.statusCode = 400;
    throw error;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmpFile = `${VEHICLES_FILE}.tmp`;
  await fs.writeFile(tmpFile, `${JSON.stringify(vehicles, null, 2)}\n`, "utf8");
  await fs.rename(tmpFile, VEHICLES_FILE);
}

function safeStaticPath(pathname) {
  const requestPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  if (requestPath.startsWith("/MazyOS/") || requestPath.startsWith("/data/")) return null;

  const filePath = path.normalize(path.join(ROOT, requestPath));
  if (!filePath.startsWith(ROOT)) return null;
  return filePath;
}

async function serveStatic(req, res, pathname) {
  if (pathname === "/admin") {
    res.writeHead(302, { Location: "/admin.html" });
    res.end();
    return;
  }

  if (pathname === "/login") {
    res.writeHead(302, { Location: "/login.html" });
    res.end();
    return;
  }

  if (adminPages.has(pathname) && !isAuthenticated(req)) {
    const next = encodeURIComponent(pathname);
    res.writeHead(302, { Location: `/login.html?next=${next}` });
    res.end();
    return;
  }

  const filePath = safeStaticPath(pathname);
  if (!filePath) {
    res.writeHead(404);
    res.end("Nao encontrado");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404);
      res.end("Nao encontrado");
      return;
    }

    console.error("Erro ao servir arquivo.", error);
    res.writeHead(500);
    res.end("Erro interno");
  }
}

async function handleApi(req, res, pathname) {
  if (pathname === "/api/session" && req.method === "GET") {
    json(res, 200, {
      authenticated: isAuthenticated(req),
      defaultPassword: ADMIN_PASSWORD === "global123",
    });
    return;
  }

  if (pathname === "/api/login" && req.method === "POST") {
    const body = await readJsonBody(req);
    const valid = body.username === ADMIN_USER && body.password === ADMIN_PASSWORD;

    if (!valid) {
      json(res, 401, { error: "Usuario ou senha invalidos." });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { username: ADMIN_USER, expiresAt: Date.now() + SESSION_TTL_MS });
    res.setHeader("Set-Cookie", sessionCookie(token));
    json(res, 200, { ok: true });
    return;
  }

  if (pathname === "/api/logout" && req.method === "POST") {
    const token = parseCookies(req).gv_session;
    if (token) sessions.delete(token);
    res.setHeader("Set-Cookie", clearSessionCookie());
    json(res, 200, { ok: true });
    return;
  }

  if (pathname === "/api/vehicles" && req.method === "GET") {
    json(res, 200, await readVehicles());
    return;
  }

  if (pathname === "/api/vehicles" && req.method === "PUT") {
    if (!isAuthenticated(req)) {
      json(res, 401, { error: "Login necessario." });
      return;
    }

    const vehicles = await readJsonBody(req);
    await writeVehicles(vehicles);
    json(res, 200, { ok: true, count: vehicles.length });
    return;
  }

  json(res, 404, { error: "Rota nao encontrada." });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }

    await serveStatic(req, res, url.pathname);
  } catch (error) {
    console.error("Erro na requisicao.", error);
    json(res, error.statusCode || 500, { error: error.message || "Erro interno." });
  }
});

server.listen(PORT, () => {
  console.log(`Global Veiculos rodando em http://localhost:${PORT}`);
  console.log(`ADM: usuario "${ADMIN_USER}"`);
  if (ADMIN_PASSWORD === "global123") {
    console.log('Senha padrao ativa: "global123". Troque ADMIN_PASSWORD antes de publicar.');
  }
});
