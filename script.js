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