const CACHE_NAME = 'ansumart-pwa-v1';
const ASSETS = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/image/icon-192.png',
  '/image/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Simple network-first strategy for a dynamic EJS app
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          // don't cache API or external unneeded requests, just basic assets if needed
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, resClone);
          }
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
