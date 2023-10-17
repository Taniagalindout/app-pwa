// Todos aquellos archivos que nuestra app utilice
const STATIC = 'staticv2'
const INMUTABLE = 'inmutablev1'
const DYNAMIC = 'dynamicv1'
const APP_SHELL = [
  '/',
  '/index.html',
  'js/app.js',
  'img/gato.jpg',
  'css/style.css',
  'img/oso.jpg',
  'pages/offline.html',
]

const APP_SHELL_INMUTABLE = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
]

self.addEventListener('install', (e) => {
  console.log('Instalando ')
  //e.skipWaiting();
  const staticCache = caches.open(STATIC).then((cache) => {
    cache.addAll(APP_SHELL)
  })
  const inmutable = caches.open(INMUTABLE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE)
  })
})

self.addEventListener('activate', (e) => {
  console.log('Activado ')
})

self.addEventListener('fetch', (e) => {

  //El que conteste primero es el que se va a ejecutar
    const source = new Promise((resolve, reject) => {
      let flag = false;
      const failsOnce = () => {
          if (flag) {
              //Si falló una vez aquí vamos a poner la lógica para controlarlo
              if (/\.(png|jpg)/i.test(e.request.url)) {
                  resolve(caches.match('/img/not-found.png'));
              } 
              if(e.request.url.includes('page2.html')) 
              {
                resolve(caches.match('pages/offline.html'));
              }
          } else {
              flag = true;
          }
      };
      fetch(e.request).then(resFetch => {
          resFetch.ok ? resolve(resFetch): failsOnce();
      }).catch(failsOnce);
      caches.match(e.request).then(sourceCache => {
          sourceCache.ok ? resolve(sourceCache): failsOnce();
      }).catch(failsOnce);
  });
  e.respondWith(source);


  // e.respondWith(
  //   cacheFirst({
  //     request: e.request,
  //     fallbackUrl: "pages/offline.html",
  //   }),
  // );

  //Cache only
  //1.-e.respondWith(caches.mate(e.request))

  // Cache with network fallback
  //Siempre busca en cache y si no en internet
  //2.-  const source = caches.match(e.request)
  //  .then(res => {
  //   if(res) return res;
  //   return fetch(e.request).then(resFetch=>{
  //     caches.open(DYNAMIC).then(cache => {
  //       cache.put(e.request, resFetch)
  //     })
  //     return resFetch.clone();
  //   })
  //  })
  //  e.respondWith(source);

  //3. Network with cache fallback
  //primero busca en inernet y despues en cache
  // const source = fetch(e.request).then(res => {
  //   if(!res) throw Error("NotFound")
  //   caches.open(DYNAMIC).then(cache=>{
  //     cache.put(e.request, res)
  //   })
  //   return res.clone();
  // })
  // .catch((err)=>{
  //   return caches.match(e.request);
  // })
  // e.respondWith(source)

  //Cache with network update
  //Primero todo lo devuelve del cache
  //Despues actualiza el recurso
  //Equipo de bajo rendimiento. Siempre se queda un paso atras
  // const source = caches.open(STATIC).then(cache => {
  //   fetch(e.request).then(resFetch =>{
  //     cache.put(e.request, resFetch)
  //   })
  //   return caches.match(e.request);
  // })
  // e.respondWith(source);

  //5. Cache and network race
  //El que conteste primero es el que se va a ejecutar
  //   const source = new Promise((resolve, reject) => {
  //     let flag = false;
  //     const failsOnce = () => {
  //         if (flag) {
  //             //Si falló una vez aquí vamos a poner la lógica para controlarlo
  //             if (/\.(png|jpg)/i.test(e.request.url)) {
  //                 resolve(caches.match('/img/not-found.png'));
  //             } else {
  //                 reject('SourceNotFound');
  //             }
  //         } else {
  //             flag = true;
  //         }
  //     };
  //     fetch(e.request).then(resFetch => {
  //         resFetch.ok ? resolve(resFetch): failsOnce();
  //     }).catch(failsOnce);
  //     caches.match(e.request).then(sourceCache => {
  //         sourceCache.ok ? resolve(sourceCache): failsOnce();
  //     }).catch(failsOnce);
  // });
  // e.respondWith(source);

  //  const source = caches.match(e.request)
  //    .then(res => {
  //     if(res) return res;
  //     return fetch(e.request).then(resFetch=>{
  //       caches.open(DYNAMIC).then(cache => {
  //         cache.put(e.request, resFetch)
  //       })
  //       return resFetch.clone();
  //     })
  //    })
  //    e.respondWith(source);
})
