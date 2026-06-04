/* sw.js — Bogotá Smile Studio v20260601 */
const CACHE = 'bss-v4'; /* bumped 2026-06-04 — 51 pages, 35 articles */
const PRECACHE = [
  '/',
  '/index.html',
  '/agencia.html',
  '/manifest.json',
  // JS local NO se precachea: los browsers los piden con ?v=FECHA (query mismatch)
  // y ya tienen Cache-Control: immutable vía _headers
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/app/')) return;

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      var networkFetch = fetch(e.request).then(function (resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          var clone = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        }
        return resp;
      });
      return cached || networkFetch;
    })
  );
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var rawUrl = e.notification.data && e.notification.data.url ? e.notification.data.url : '/';
  var safeUrl = /^https?:\/\/bogotasmilestudio\.com\//.test(rawUrl) || rawUrl.startsWith('/') ? rawUrl : '/';
  e.waitUntil(clients.openWindow(safeUrl));
});

/* ── WEB PUSH ─────────────────────────────────────────────── */
self.addEventListener('push', function(e) {
  if (!e.data) return;
  var data;
  try { data = e.data.json(); } catch(_){ data = { title: 'Bogotá Smile Studio', body: e.data.text() }; }

  var safeUrl = data.url && (
    /^https?:\/\/bogotasmilestudio\.com\//.test(data.url) || data.url.startsWith('/')
  ) ? data.url : '/';

  e.waitUntil(
    self.registration.showNotification(data.title || 'Bogotá Smile Studio', {
      body:  data.body  || '',
      icon:  data.icon  || '/assets/icon-192.png',
      badge: data.badge || '/assets/icon-192.png',
      data:  { url: safeUrl },
      tag:   data.tag   || 'bss-notification',
      requireInteraction: false
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(e) {
  /* Resubscribe si la suscripción cambia */
  e.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .catch(function(){})
  );
});
