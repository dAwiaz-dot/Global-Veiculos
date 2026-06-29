const CACHE_NAME = "global-veiculos-pwa-v1";
const PUBLIC_SHELL = [
  "/",
  "/index.html",
  "/veiculos.html",
  "/vehicle.html",
  "/sobre.html",
  "/troca.html",
  "/financiamento.html",
  "/contato.html",
  "/privacidade.html",
  "/offline.html",
  "/style.css",
  "/script.js",
  "/vehicle.js",
  "/pwa.js",
  "/manifest.webmanifest",
  "/assets/global-veiculos-logo.jpg",
  "/assets/pwa-icon-192.png",
  "/assets/pwa-icon-512.png",
  "/assets/instagram/ford-focus-titanium.jpg",
  "/assets/instagram/chevrolet-cruze-lt.jpg",
  "/assets/instagram/chevrolet-agile-ltz.jpg",
  "/assets/instagram/renault-duster-expression.jpg"
];

function isAdminPath(pathname) {
  return pathname === "/login.html" || pathname.startsWith("/admin");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PUBLIC_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || isAdminPath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
