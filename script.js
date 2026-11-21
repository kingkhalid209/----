// أضف هذا داخل حدث 'activate'
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    
    // إنشاء قناة إشعارات عالية الأهمية
    if ('NotificationChannel' in self.registration.notifications) {
        const highPriorityChannel = new NotificationChannel(
            'high-priority-alerts', // معرف القناة
            'تنبيهات هامة', // اسم القناة الذي يظهر للمستخدم
            {
                importance: self.registration.notifications.IMPORTANCE_HIGH,
                enableVibration: true,
                enableLights: true,
                showBadge: true,
                vibrationPattern: [200, 100, 200]
            }
        );
        self.registration.notifications.createNotificationChannel(highPriorityChannel);
    }
});

// وفي حدث 'message' أو 'push'، استخدم معرف القناة عند عرض الإشعار
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'notify') {
        const options = {
            body: event.data.body,
            icon: event.data.icon,
            tag: event.data.tag || 'jarres-notification',
            vibrate: event.data.vibrate || [300, 100, 300],
            requireInteraction: true, // يجعل الإشعار يبقى حتى يتفاعل معه المستخدم
            priority: 'high', // يطلب أولوية عالية من النظام
            channelId: 'high-priority-alerts', // ربط الإشعار بالقناة عالية الأهمية
            data: { url: event.data.url }
        };
        self.registration.showNotification(event.data.title, options);
    }
});
