// Service Worker for Sınav TR PWA
const CACHE_NAME = 'sinav-tr-v1';
const DYNAMIC_CACHE = 'sinav-tr-dynamic-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE;
          })
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // API calls - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - Cache First strategy
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2|woff|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  // HTML pages - Network First with offline fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-answers') {
    event.waitUntil(syncAnswers());
  }
});

async function syncAnswers() {
  try {
    const cache = await caches.open('offline-answers');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const data = await response.json();
      
      // Send to server
      const serverResponse = await fetch('/api/exams/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (serverResponse.ok) {
        // Remove from cache if successful
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icons/xmark.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Sınav TR', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync for updating cached content
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-questions') {
    event.waitUntil(updateQuestions());
  }
});

async function updateQuestions() {
  try {
    const response = await fetch('/api/questions/updates');
    const data = await response.json();
    
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put('/api/questions/updates', new Response(JSON.stringify(data)));
    
    // Send notification if new questions are available
    if (data.newQuestions > 0) {
      self.registration.showNotification('Yeni Sorular!', {
        body: `${data.newQuestions} yeni soru eklendi. Hemen çözmeye başla!`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
      });
    }
  } catch (error) {
    console.error('Update questions failed:', error);
  }
}

// Message handler for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache management - limit cache size
async function limitCacheSize(name, size) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > size) {
    cache.delete(keys[0]);
    limitCacheSize(name, size);
  }
}

// Clean up old caches periodically
setInterval(() => {
  limitCacheSize(DYNAMIC_CACHE, 50);
}, 1000 * 60 * 60); // Every hour
