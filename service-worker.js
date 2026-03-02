const CACHE_NAME = "smartfinance-v1";

// Daftar asset yang akan disimpan agar aplikasi bisa jalan offline
const assets = [
  "/",
  "/index.html",
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://unpkg.com/lucide@latest"
];

// Install Service Worker: Menyimpan assets ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets...");
      return cache.addAll(assets);
    })
  );
});

// Activate: Membersihkan cache lama jika ada versi baru
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Mengambil dari cache dulu, jika tidak ada baru ambil ke internet
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // Opsional: Simpan request baru ke cache secara dinamis
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
        // Jika offline dan tidak ada di cache, bisa arahkan ke halaman offline jika ada
    })
  );
});
