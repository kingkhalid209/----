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
    const targetUrl = event.notification.data && event.notification.data.url;
    if (!targetUrl) return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                // التحقق من أن النافذة تتبع لنفس النطاق (بدلاً من كلمة 'jarres' فقط)
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    // إذا كانت النافذة موجودة ولكن على رابط مختلف، وجّهها للرابط المطلوب
                    if ('navigate' in client && client.url !== targetUrl) {
                        client.navigate(targetUrl);
                    }
                    return client.focus(); // إعادة التركيز على النافذة الموجودة
                }
            }
            // إذا لم توجد نافذة مفتوحة، افتح واحدة جديدة (وهذا قد يفتح التطبيق المثبت في وضع Standalone)
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// في ملف JavaScript الخاص بالصفحة الرئيسية
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // يمنع ظهور شريط التثبيت التلقائي من كروم
    // يمكنك هنا تخزين الحدث e واستخدامه لاحقًا إذا أردت عرض زر تثبيت مخصص
    // deferredPrompt = e;
});
