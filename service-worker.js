// Service Worker für die Karteikarten-PWA
// Cache-First-Strategie: App läuft komplett offline, sobald sie einmal geladen wurde.

const CACHE_NAME = "lernapp-cache-v4";

// Dateien, die beim Installieren gecacht werden (App-Shell).
const APP_SHELL = [
  "./",
  "./index.html",
  "./questions.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://cdn.tailwindcss.com"
];

// Installieren: App-Shell in den Cache legen.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // addAll bricht ab, wenn eine Datei fehlt -> einzeln & fehlertolerant cachen.
      Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch(() => {/* einzelne Datei darf fehlschlagen */})
        )
      )
    )
  );
  self.skipWaiting();
});

// Aktivieren: alte Caches aufräumen.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Abrufen: erst Cache, dann Netzwerk. Neue Antworten nachträglich cachen.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Nur gültige Antworten cachen.
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          // Offline & nicht im Cache: für Navigation auf index.html zurückfallen.
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
