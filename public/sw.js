/* Portfolio service worker. Offline fallback, never a stale asset. */

/* Bumping this name is what evicts the previous cache on activate. Bump it
   whenever the strategy below changes, so returning visitors are not left
   being served by the old worker's rules. */
const CACHE = "portfolio-v4";
const ASSETS = [
  "/favicon.svg",
  "/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Skip Next.js data / HMR / analytics. Let the network handle these.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_next/")) return;
  if (url.pathname.startsWith("/api/")) return;

  // Network first, for documents and for assets alike.
  //
  // This used to be cache-first for everything that was not a document, which
  // meant /figures/*.png were frozen in the cache the first time a visitor
  // loaded them and never revalidated. Replacing a project screenshot changed
  // nothing for anyone who had already been here: they kept seeing the old one
  // until they hard-refreshed, because a hard refresh is the one thing that
  // bypasses the worker. A screenshot of the wrong version of my own work is
  // worse than a slower second visit, so the network decides and the cache is
  // only the offline fallback.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone)).catch(() => null);
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
