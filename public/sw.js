// Minimal service worker for push notifications.
// No offline caching — this is not an offline-first app.

self.addEventListener('push', (event) => {
  let data = { title: 'Sproutine', body: 'Time to do your prep!', icon: '/Khan%20Icon.png', badge: '/Khan%20Icon.png', data: { url: '/' } }
  try {
    if (event.data) data = event.data.json()
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data.data,
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.openWindow(url))
})
