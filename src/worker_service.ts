/**   ________          __  __________  ______
 *   / ____/ /_  ____ _/ /_/ ____/ __ \/_  __/
 *  / /   / __ \/ __ `/ __/ / __/ /_/ / / /
 * / /___/ / / / /_/ / /_/ /_/ / ____/ / /
 * \____/_/ /_/\__,_/\__/\____/_/     /_/
 *
 * [warning] This code was written entirely by chatgpt,
 * and only a few typescript adjustments were made,
 * it is not very important and I believe it will never be modified again.
 *
 * Rodrigo Dornelles.
 */

interface ExperimentalEvent extends Event {
    request?: URL | RequestInfo
    waitUntil?: (promise: Promise<void | Cache>) => void
    respondWith?: (promise: Promise<void | Response | undefined>) => void
}

const CACHE_NAME = 'pwa-chrfonts'

const urlsToCache = ['/index.html', 'favicon.ico']

self.addEventListener('install', (event: ExperimentalEvent) => {
    if (event.waitUntil) {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(urlsToCache)
            }),
        )
    }
})

self.addEventListener('fetch', (event: ExperimentalEvent) => {
    if (event.respondWith && event.request) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response || event.request == undefined) {
                    return response
                }
                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response
                    }

                    const responseToCache = response.clone()

                    caches.open(CACHE_NAME).then((cache) => {
                        if (event.request) {
                            cache.put(event.request, responseToCache)
                        }
                    })

                    return response
                })
            }),
        )
    }
})
