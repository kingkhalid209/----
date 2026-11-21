self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('message',e=>{
  const d=e.data;
  if(d&&d.type==='notify'){
    e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:d.icon,tag:d.tag||'jarres',vibrate:d.vibrate||[300,100,300],requireInteraction:true,data:{url:d.url}}));
  }
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus'in c)return c.focus();}
    if(self.clients.openWindow)return self.clients.openWindow(url);
  }));
});
