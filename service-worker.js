const CACHE_NAME = 'nazwa';
// List of files which are store in cache.
let filesToCache = [
 '/',
 '/css/style.css',
 '/images/logo.svg',
 '/script.js'
];
self.addEventListener('install', function (evt) {
 evt.waitUntil(
 caches.open(CACHE_NAME).then(function (cache) {
 return cache.addAll(filesToCache);
 }).catch(function (err) {
 //console.error(err);
 })
 );
});
self.addEventListener('fetch', function (evt) {
 // console.log(event.request.url);
 evt.respondWith(
 // Firstly, send request..
 fetch(evt.request).catch(function () {
 // When request failed, return file from cache...
 return caches.match(evt.request);
 })
 );
});
