const BASE=new URL('.',self.location.href).pathname;
const PREFIX='battle-trainer-pwa-'+BASE.replace(/\W/g,'_')+'-';
const CACHE=PREFIX+'v1';
const FILES=['index.html','style.css','data.js','engine.js','app.js','pwa.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'].map(file=>BASE+file);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'&&(url.pathname===BASE||url.pathname===BASE+'index.html')){
    event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(BASE+'index.html'))||fetch(event.request)));
  }else if(FILES.includes(url.pathname)){
    event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(event.request)));
  }
});
