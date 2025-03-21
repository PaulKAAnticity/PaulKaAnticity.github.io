// Define cache names
const CACHE_NAME = 'blazor-cache-v1';
const ASSETS_TO_CACHE = [
    '/', // Cache the root page
    'index.html', // Cache the entry point
    'manifest.webmanifest', // Cache the web manifest
    '_framework/blazor.webassembly.js', // Cache Blazor framework files
    '_framework/dotnet.wasm', // Cache WebAssembly runtime
    '_framework/dotnet.timezones.blat',
    '_framework/icudt.dat',
    '_framework/icudt_CJK.dat',
    '_framework/icudt_EFIGS.dat',
    '_framework/icudt_no_CJK.dat',
    '_framework/blazor.boot.json',
    'css/site.css', // Cache your CSS files
    'YourAssemblyName.styles.css', // Cache generated styles (if any)
    'images/favicon.ico', // Cache favicon
    'images/icon-192.png', // Cache app icons
    'images/icon-512.png',
];

// Install event: cache all required assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching all assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: serve cached assets when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
