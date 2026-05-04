// Service worker. Hand-rolled instead of via Workbox / vite-plugin-pwa because
// the precache surface is small and the caching strategy is straightforward.
// Bumping CACHE_NAME on a breaking change discards old entries on activate.
//
// Strategy:
//   1. install: precache the install-criteria minimum (app shell + manifest +
//      icons). These are the URLs we know in advance and that browsers need
//      present for "Add to Home Screen" to succeed.
//   2. fetch: cache-first for same-origin GETs. After the first online visit
//      every requested asset (including Vite's hashed JS/CSS chunks) lands in
//      the cache, so subsequent loads work offline. The cost is that the
//      *first* visit after install can't go offline until the user has loaded
//      every code path they want available; an explicit precache manifest
//      would close that gap and is the obvious upgrade path.
//   3. activate: drop caches whose name doesn't match CACHE_NAME so old
//      versions don't accumulate.
//
// COOP/COEP/CORP headers ride on the cached Response objects automatically
// (the Cache API stores headers verbatim), so cross-origin isolation is
// preserved on cache hits.

const CACHE_NAME = "wasmux-v1";

// Files known by name at build time. Vite copies public/ verbatim, so these
// land at the build root with stable URLs. Hashed chunks are picked up
// lazily by the runtime cache-first handler below.
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-maskable.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // addAll fails atomically: if any URL 404s the install rejects and the
      // SW doesn't activate. That's the desired behaviour, missing precache
      // entries should fail loud.
      .then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  // skipWaiting lets a new SW take over without waiting for every tab to
  // close. Combined with the activate-time cache cleanup below, deploys
  // propagate within one reload.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin GETs. POST/PUT/etc. go straight to network; we
  // have no business caching mutations. Cross-origin requests aren't ours
  // to cache and could leak referer info if mishandled.
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      // Cache-miss path: fetch from network, populate cache, return response.
      // Clone the response because Response bodies can only be read once,
      // and both cache.put and the return path need the body.
      return fetch(request).then((response) => {
        // Only cache successful, basic (same-origin) responses; opaque or
        // error responses aren't useful in cache and might mask real bugs.
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
