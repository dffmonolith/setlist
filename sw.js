// Setlist Pitch Pipe — service worker.
//
// Strategy: cache-first for the app shell. setlist.html carries all the piano
// samples inline, so once it's cached the whole app works with no network.
//
// Updating: bump CACHE_VERSION whenever any precached file changes. The new
// worker installs quietly in the background but does NOT take over on its
// own; the page shows a small "update ready" link instead, so a new version
// never swaps in mid-concert. Tapping it (or fully closing and reopening the
// app) activates the new version.

const CACHE_VERSION = 'v2.5';
const CACHE_NAME = 'setlist-' + CACHE_VERSION;

const PRECACHE = [
  './',
  'index.html',
  'setlist.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

const PRECACHE_URLS = new Set(PRECACHE.map(p => new URL(p, self.registration.scope).href));
const APP_URL = new URL('setlist.html', self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // cache:'reload' bypasses the browser's HTTP cache (GitHub Pages sends
    // max-age=600), so a fresh install never captures a stale copy.
    await cache.addAll(PRECACHE.map(p => new Request(p, { cache: 'reload' })));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k.startsWith('setlist-') && k !== CACHE_NAME)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  url.search = '';
  url.hash = '';
  const key = url.href;

  // Anything we didn't precache (e.g. the portfolio site's shared nav and
  // analytics scripts) goes straight to the network as usual; offline, those
  // simply fail and the app doesn't depend on them.
  const inScopeNav = req.mode === 'navigate' && key.startsWith(self.registration.scope);
  if (!PRECACHE_URLS.has(key) && !inScopeNav) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(key);
    if (hit) return hit;
    try {
      return await fetch(req);
    } catch (e) {
      // Offline and not cached (an unexpected in-scope URL): fall back to the app.
      if (inScopeNav) {
        const app = await cache.match(APP_URL);
        if (app) return app;
      }
      throw e;
    }
  })());
});
