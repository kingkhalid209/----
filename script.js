self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'notify') {
        const options = {
            body: event.data.body,
            icon: event.data.icon,
            tag: event.data.tag || 'jarres-notification',
            vibrate: event.data.vibrate || [300, 100, 300],
            requireInteraction: true,
            data: { url: event.data.url }
        };
        self.registration.showNotification(event.data.title, options);
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    let client = clientList[i];
                    if (client.url.includes('jarres') && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data.url);
                }
            })
        );
    }
});

{
  "name": "جرّس | نظام البيجر الذكي",
  "short_name": "جرّس",
  "description": "جوال عميلك يرن أول ما يجهز طلبه",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "any",
  "lang": "ar",
  "dir": "rtl",
  "background_color": "#0b1120",
  "theme_color": "#0b1120",
  "icons": [
    {
      "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAYFBMVEX5cxb///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRcZzuAAAAIHRSTlP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////5fIVy0AAAHvSURBVHja7d1hboMwEEThmb3/oStVqpoEcN1SsJ8ze4L3kQSj/GBVHaNB09U2aXu3QnPX/2zQ/Pltggj5LYIY+ccEUfKPCAL17woEyt8liNW/FQjWvxGI1v8qEK7/RSBe/7NAwP4ngYj9jwIh+x8EYvZ/C5YBSFCBqP1fgkUAElawBkDiCpYASGDBCgCJLAhgPEDoCSCAuQH+nGsB1/dfK7ghH0ugA2y2wIYLAggggLVuQznIAjj1A2Ap3Bh4PoDgjoHnT0zwL4beP6PARgv8h6H3zySw2QKbLbDZAhsuoANstsBmC2y4gA6w4QI6wIYL6AAbLqADbLgggMEAGy4IIIA3B9hwQQABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABjO2/XUAH2HABHWCzBTZbYLMFNlXg2waefw3BhgvoABsuCCCAdwfkNvpuJ1mehf4XLORMeElPfOHo/Su83yaA4f8bBRBAAAEEkIMsz0ILPo3WLYIL8+uOz0BMwD2vLs/L44cDsoMjgLOAbAIaDsg2rOGAbIQbDshWxOEA/GLN7GYdD8Cv9+UvWOavuOYvGeeveWcIqgUoWv8GULD+LaBY/TuAmQl7sQUSVC9gTsJBaRWDcNhZRSA0KqvmJzQbqz1z13cAhip62j4AGY8pv0SwxOkAAAAASUVORK5CYII=",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
 },
    {
      "src": "data:image/png;base64,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",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
