/* Lista Spesa Service Worker — shell + asset offline.
   I dati vivono in localStorage (cache locale) + Supabase; qui cachiamo
   solo lo shell statico. Bump di SW_VERSION per forzare l'aggiornamento. */
const SW_VERSION = 'v1.0.0';
const CACHE = 'lista-spesa-' + SW_VERSION;
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './config/supabase-config.js',
  './data/categories.js',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.png',
  './sw.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Navigazioni: rete prima, cache come fallback (shell offline).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html')).then((r) => r || caches.match('./'))
    );
    return;
  }

  // GET same-origin (asset statici): stale-while-revalidate.
  if (req.method === 'GET' && url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(req, clone));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Cross-origin (Supabase): pass-through.
});
