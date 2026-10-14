const CACHE = __CACHE__;
const BASE = __BASE__;
const FILES = __FILES__;
const PREFIX = CACHE.slice(0, CACHE.lastIndexOf('-') + 1);

self.addEventListener('install', event => {
  // Installation completes only when every recipe and dependency is cached.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  // Scaling and variant query strings use the same page; the client restores state.
  const key = url.origin + url.pathname;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(key);
    if(cached)return cached;
    try{return await fetch(event.request);}catch{
      return new Response('Sidan finns inte sparad offline. Öppna Receptboken när du har internetanslutning.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
