// Service Worker（アプリを裏で支える小さなプログラム）
// 役割: ファイルを保存しておいて、電波が悪くてもアプリを開けるようにする
const CACHE_NAME = "wasuremono-tag-v1";
const FILES = [
  "./",
  "./index.html",
  "./shindan.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// インストール時: ファイルを保存
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

// 更新時: 古い保存データを掃除
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ページを開く時: まずネットから取得、ダメなら保存データを使う
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
