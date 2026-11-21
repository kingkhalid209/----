const CACHE = 'jarres-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const hit = await caches.match(e.request);
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res && res.ok) {
        const c = await caches.open(CACHE);
        c.put(e.request, res.clone());
      }
      return res;
    } catch (_) { return Response.error(); }
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'notify') {
    e.waitUntil(self.registration.showNotification(e.data.title, {
      body: e.data.body, icon: e.data.icon, tag: e.data.tag || 'jarres',
      vibrate: e.data.vibrate || [300, 100, 300], requireInteraction: true,
      data: { url: e.data.url }
    }));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url === url && 'focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
