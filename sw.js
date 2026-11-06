var NAME = 'mira-v1';
var DATEIEN = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(NAME).then(function (c) { return c.addAll(DATEIEN); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') { return; }
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) { return; }
  e.respondWith(fetch(e.request).then(function (r) {
    var kopie = r.clone();
    caches.open(NAME).then(function (c) { c.put(e.request, kopie); });
    return r;
  }).catch(function () { return caches.match(e.request); }));
});
