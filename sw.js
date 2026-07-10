/* Lore – Service Worker (v2) */
const SHELL = 'lore-shell-v2';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './js/jszip.min.js',
  './js/epub.min.js',
  './fonts/Fraunces.ttf',
  './fonts/Fraunces-Italic.ttf',
  './fonts/SpaceGrotesk.ttf',
  './fonts/Literata.ttf',
  './fonts/OpenDyslexic-Regular.woff',
  './fonts/OpenDyslexic-Bold.woff',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== SHELL).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // analytics etc. go straight to the network

  e.respondWith(
    caches.match(e.request).then(hit => hit ||
      fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put(e.request, copy));
        }
        return res;
      })
    )
  );
});
