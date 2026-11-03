// Euphoria Estilo — funciona offline
const CACHE = 'euphoria-57dd1a6d';
const ARQUIVOS = ["./", "index.html", "fotos.js", "figura.webp", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // página: tenta a rede primeiro (pega atualizações), cai no cache sem internet
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./', c)); return r; }).catch(() => caches.match('./').then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
