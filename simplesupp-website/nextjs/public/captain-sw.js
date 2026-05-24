// Service Worker v2 for Reece's Captain Seat
// Handles push notifications — NO aggressive caching

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear any old caches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Don't cache anything — always fetch fresh
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
  let data = { title: "Captain Seat", body: "You have a new update.", icon: '/captain-wheel.svg' };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch (e) { data.body = event.data.text(); }
  }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/captain-wheel.svg',
    badge: '/captain-wheel.svg',
    vibrate: [200, 100, 200],
    tag: data.tag || 'captain-update',
    renotify: true,
    data: { url: data.url || '/command-center' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/command-center';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes('/command-center') && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
