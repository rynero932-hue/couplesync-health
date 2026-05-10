// public/firebase-messaging-sw.js
// Service Worker for Firebase Cloud Messaging background notifications
// This file must be at the root of your domain.

importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyBUtoV_7JsFSqPbkfMnThv4lRFN8DdRvrY',
  authDomain:        'couplesync-health.firebaseapp.com',
  projectId:         'couplesync-health',
  storageBucket:     'couplesync-health.firebasestorage.app',
  messagingSenderId: '135310192337',
  appId:             '1:135310192337:web:649ba80febb70c2aeb1ff0',
});

const messaging = firebase.messaging();

// Handle background messages (when app is closed/minimized)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);

  const notificationTitle = payload.notification?.title || 'Better Together 💜';
  const notificationOptions = {
    body:    payload.notification?.body || 'Ada update dari pasanganmu!',
    icon:    '/favicon.svg',
    badge:   '/favicon.svg',
    vibrate: [200, 100, 200],
    data:    payload.data || {},
    actions: [
      { action: 'open', title: 'Buka App' },
      { action: 'dismiss', title: 'Tutup' },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('couplesync-health') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
