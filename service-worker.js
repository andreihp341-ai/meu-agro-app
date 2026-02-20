const CACHE_NAME = 'agrovision-pro-v1';

// Arquivos básicos que o aplicativo vai salvar no celular do usuário
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto com sucesso');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Ativação e limpeza de caches antigos (útil quando você atualiza o app)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptando requisições da internet
self.addEventListener('fetch', (event) => {
  // REGRA DE OURO: Não faz cache das chamadas para a IA! 
  // A IA precisa responder ao vivo sempre.
  if (event.request.url.includes('/.netlify/functions/gemini')) {
    return; 
  }

  // Para o resto do site (visual), tenta usar o cache primeiro
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se achar, senão busca na internet
        return response || fetch(event.request);
      })
  );
});
