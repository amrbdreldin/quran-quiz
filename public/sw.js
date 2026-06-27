const CACHE_NAME = 'quraan-exam-v2';

// App shell assets to pre-cache
const PRECACHE_ASSETS = [
  '/',
  '/login',
  '/register',
  '/result',
  '/manifest.json',
  '/icons/icon-192.png',
  '/logo.png',
  '/photo10.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We don't strictly wait for all to cache, as some Next.js routes
      // might fail if not generated yet. 
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('SW Precache failed for some assets, continuing anyway', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Bypass service worker during local development to prevent HMR and Fast Refresh errors
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Network-first for API requests
  if (url.origin === 'https://watawanu.com') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response and cache it
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, resClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Return a custom offline API response
            return new Response(
              JSON.stringify({
                code: 0,
                message: 'أنت غير متصل بالإنترنت حالياً',
                data: null
              }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Cache-first for static assets and Next.js /_next/ static files
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|css|js|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, resClone));
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for HTML page requests
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {
          // Catch fetch errors (e.g. offline)
        });
        
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
