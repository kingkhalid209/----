/* ===== 🎨 الشعار المدمج — ممتلئ بدون حواف + مانيفست بروابط مطلقة ===== */
(function installJarresIcon(){
  function drawBell(size){
    const c=document.createElement('canvas');c.width=c.height=size;
    const x=c.getContext('2d');
    const bg=x.createLinearGradient(0,0,size,size);
    bg.addColorStop(0,'#f97316');bg.addColorStop(1,'#ea580c');
    x.fillStyle=bg;
    x.fillRect(0,0,size,size);
    x.font=Math.round(size*0.60)+'px serif';
    x.textAlign='center';x.textBaseline='middle';
    x.fillText('🔔',size/2,size*0.54);
    return c.toDataURL('image/png');
  }
  const icons={180:drawBell(180),192:drawBell(192),512:drawBell(512)};
  const fav=document.getElementById('dyn-fav');if(fav)fav.href=icons[192];
  const ap1=document.getElementById('dyn-apple');if(ap1)ap1.href=icons[180];
  const ap2=document.getElementById('dyn-apple-180');if(ap2)ap2.href=icons[180];
  const ap3=document.getElementById('dyn-apple-192');if(ap3)ap3.href=icons[192];
  const ap4=document.getElementById('dyn-apple-512');if(ap4)ap4.href=icons[512];
  const base=location.origin+location.pathname.replace(/index\.html$/,'');
  const manifest={
    id:base,
    name:'جرّس | نظام البيجر الذكي',
    short_name:'جرّس',
    description:'جوال عميلك يرن أول ما يجهز طلبه',
    lang:'ar',dir:'rtl',
    start_url:base,
    scope:base,
    display:'standalone',
    orientation:'portrait',
    background_color:'#0b1120',
    theme_color:'#0b1120',
    icons:[
      {src:icons[192],sizes:'192x192',type:'image/png',purpose:'any'},
      {src:icons[512],sizes:'512x512',type:'image/png',purpose:'any'},
      {src:icons[512],sizes:'512x512',type:'image/png',purpose:'maskable'}
    ]
  };
  const blob=new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'});
  const ml=document.getElementById('dyn-manifest');if(ml)ml.href=URL.createObjectURL(blob);
  window.jarresIconDataUrl=icons[192];
})();

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
