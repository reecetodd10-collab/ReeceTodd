// Service Worker for Reece's Captain Seat
// Handles push notifications and offline caching

const CACHE_NAME = 'captain-seat-v1';
const OFFLINE_URLS = ['/command-center'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  let data = { title: "Captain Seat", body: "You have a new update.", icon: '/captain-wheel.svg' };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/captain-wheel.svg',
    badge: '/captain-wheel.svg',
    vibrate: [200, 100, 200],
    tag: data.tag || 'captain-update',
    renotify: true,
    data: {
      url: data.url || '/command-center',
    },
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/command-center';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('/command-center') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Background sync for checking updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  try {
    const response = await fetch('/api/command-center/notifications/check');
    const data = await response.json();
    if (data.notifications && data.notifications.length > 0) {
      for (const notif of data.notifications) {
        await self.registration.showNotification(notif.title, {
          body: notif.body,
          icon: '/captain-wheel.svg',
          badge: '/captain-wheel.svg',
          vibrate: [200, 100, 200],
          tag: notif.tag,
          data: { url: '/command-center' },
        });
      }
    }
  } catch (e) {
    // Silently fail — will retry on next sync
  }
}
