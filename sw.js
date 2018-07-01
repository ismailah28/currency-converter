const dataCacheName = 'currency-v1';
const cacheName = 'currency-v2';
const filesToCache = [
        '/',
        'js/index.js',
        'css/index.css',
        'css/bootstrap.min.css',
        'https://free.currencyconverterapi.com/api/v5/currencies',
      ];

self.addEventListener('install', event => {
   console.log('ServiceWorker Installed');
  event.waitUntil(
    caches.open(dataCacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('ServiceWorker Activated');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('ServiceWorker Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  //console.log('[Service Worker] Fetch', event.request);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});