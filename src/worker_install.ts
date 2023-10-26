if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('worker_service.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope)
            })
            .catch((error) => {
                console.warn('Service Worker registration failed:', error)
            })
    })
}
