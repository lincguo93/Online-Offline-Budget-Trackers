const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/style.css',
    '/db.js',
    '/manifest.json',
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

const CACHE_NAME = 'cache-v1';
const DATA_CACHE_NAME = 'data-cache';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
            .keys()
            .then((keylist) => {
                return Promise.all(
                    keylist.map((key) => {
                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            return caches.delete(key);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request).then((response) => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                      }
        
                      return response;
                    })
                    .catch((err) => {
                      return cache.match(evt.request);
                    });
                })
                .catch((err) => console.log(err))
            );
        
            return;
          }
        
          evt.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
              return cache.match(evt.request).then((response) => {
                return response || fetch(evt.request);
              });
            })
          );
        });