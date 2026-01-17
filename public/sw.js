const CACHE_NAME = 'learning-journal-v2';
const STATIC_CACHE = 'learning-journal-static-v2';
const DYNAMIC_CACHE = 'learning-journal-dynamic-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/app-icon-192.png',
  '/app-icon-512.png'
];

self.addEventListener('install', event => {
  console.log('Learning Journal SW: Installing...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Learning Journal SW: Caching static assets');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache some resources:', err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Learning Journal SW: Activating...');
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Learning Journal SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache first for static assets
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For navigation requests, return the cached index page
    if (request.mode === 'navigate') {
      const indexCache = await caches.match('/');
      if (indexCache) return indexCache;
    }
    
    return new Response('Offline - Content not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline', message: 'Data will sync when online' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Learning Journal Service Worker loaded');
