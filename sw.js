// Service Worker for Core Engineering
const CACHE_NAME = 'core-engineering-v1';
const ASSETS = [
'/',
'/index.html',
'/css/bootstrap.min.css',
'/css/core.css',
'/css/custom.css',
'/dist/js/main.min.js',
'/images/logo/core_logo.png'
];

self.addEventListener('install', event => {
event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(ASSETS))
);
});

self.addEventListener('fetch', event => {
event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request))
);
});

// Clean up old caches
self.addEventListener('activate', event => {
event.waitUntil(
    caches.keys().then(keys => Promise.all(
    keys.map(key => {
        if (key !== CACHE_NAME) {
        return caches.delete(key);
        }
    })
    ))
);
});