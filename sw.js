/**
 * Service Worker - Passo 6: Radar do Investidor (Precificação de Ativos)
 * Versão 2.0 - Estratégia Network-First para conteúdo dinâmico
 */

const CACHE_NAME = 'radar-precificacao-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css?v=20261007b',
  './js/analytics.js?v=20261007b',
  './js/app.js?v=20261007b',
  './manifest.json',
  './assets/icon-192.svg',
  './assets/icon-512.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v2] Armazenando versão atualizada');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW v2] Purgando cache antigo:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Para navegação HTML: Network-First (busca na rede primeiro para sempre exibir a versão mais recente)
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match(event.request);
        })
    );
    return;
  }

  // Para outros assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
