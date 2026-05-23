const CACHE_NAME = 'bodylog-v1';
const urlsToCache = [
  '/cocobody/diet_app_v2.html',
  '/cocobody/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
