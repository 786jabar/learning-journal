const CACHE_NAME = 'learning-journal-v4';
const STATIC_CACHE = 'learning-journal-static-v4';
const DYNAMIC_CACHE = 'learning-journal-dynamic-v4';

const urlsToCache = [
  '/',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  console.log('Learning Journal SW v4: Installing - forcing update...');
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Learning Journal SW: Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return caches.open(STATIC_CACHE).then(cache => {
        console.log('Learning Journal SW: Caching new assets');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache some resources:', err);
        });
      });
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Learning Journal SW v4: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return !cacheName.includes('v4');
        }).map(cacheName => {
          console.log('Learning Journal SW: Deleting old cache:', cacheName);
          return caches.delete(cacheName);
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

  // Network first for HTML pages and navigation to always get fresh content
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.includes('/assets/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Network first for everything in development to ensure fresh content
  event.respondWith(networkFirst(event.request));
});

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

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    }).then(() => {
      event.source.postMessage({ type: 'CACHES_CLEARED' });
    });
  }
});

console.log('Learning Journal Service Worker v4 loaded - network first strategy');
