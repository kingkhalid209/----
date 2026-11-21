const CACHE='jarres-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const hit=await caches.match(e.request);
    if(hit)return hit;
    try{const res=await fetch(e.request);if(res&&res.ok){const c=await caches.open(CACHE);c.put(e.request,res.clone());}return res;}catch(_){return Response.error();}
  })());
});
self.addEventListener('message',e=>{
  const d=e.data;
  if(d&&d.type==='notify'){
    e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:d.icon,tag:d.tag||'jarres',vibrate:d.vibrate||[300,100,300],requireInteraction:true,data:{url:d.url}}));
  }
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of list){if(c.url===url&&'focus'in c)return c.focus();}
    for(const c of list){if(c.url.startsWith(self.registration.scope)&&'focus'in c){try{if('navigate'in c)await c.navigate(url);}catch(_){}return c.focus();}}
    if(self.clients.openWindow)return self.clients.openWindow(url);
  })());
});
