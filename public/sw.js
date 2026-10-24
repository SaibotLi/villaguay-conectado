// VillaguayConectado — Service Worker Nativo
// Prioridades: instalabilidad PWA, seguridad de datos, no interferir con Firebase ni APIs.

const CACHE_NAME = 'villaguayconectado-shell-v1';

// Recursos estáticos públicos mínimos para el arranque del shell
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/icons/apple-touch-icon.png'
];

// Dominios externos explícitamente excluidos de cualquier intercepción
const BYPASS_HOSTS = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebaseinstallations.googleapis.com',
  'villaguay-media-api.tobil8485.workers.dev',
  'maps.googleapis.com',
  'maps.google.com'
];

// Instalación: precachea recursos esenciales del shell público
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Activa inmediatamente el nuevo SW
      return self.skipWaiting();
    })
  );
});

// Activación: limpia versiones viejas de caché y toma control de clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Intercepción de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Solo interceptar peticiones GET
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 2. Seguridad: BYPASS total para servicios externos (Firebase, Auth, R2 Worker, Maps)
  if (BYPASS_HOSTS.some((host) => url.hostname.includes(host))) {
    return;
  }

  // 3. Seguridad: Solo atender el origen propio de la aplicación
  if (url.origin !== self.location.origin) {
    return;
  }

  // 4. Manejo de navegación (HTML Shell) -> Estrategia: Network-First
  // Garantiza recibir siempre el index.html más reciente al estar online.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la respuesta es válida, actualizamos la copia del shell genérico en caché
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/', responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Si no hay red, devolvemos el shell cacheado para que React Router maneje la vista
          const cachedShell = await caches.match('/');
          if (cachedShell) {
            return cachedShell;
          }
          // Fallback mínimo explícito en caso de no existir caché
          return new Response(
            '<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><title>Sin conexión | VillaguayConectado</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:system-ui,sans-serif;text-align:center;padding:2rem;color:#1B1F1D;background:#F8FAFA;"><h1>Sin conexión a internet</h1><p>VillaguayConectado requiere conexión a internet para sincronizar los eventos locales.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 5. Assets inmutables compilados por Vite (/assets/*.js, /assets/*.css) e íconos locales
  // Los archivos en /assets/ contienen hashes de contenido (inmutables por definición).
  const isViteAsset = url.pathname.startsWith('/assets/');
  const isStaticIcon = url.pathname.startsWith('/icons/') || url.pathname === '/favicon.png' || url.pathname === '/manifest.webmanifest';

  if (isViteAsset || isStaticIcon) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Cualquier otra petición interna GET se deja pasar a la red directamente sin cachear
});
