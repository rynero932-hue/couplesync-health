importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyBUtoV_7JsFSqPbkfMnThv4lRFN8DdRvrY',
  authDomain: 'couplesync-health.firebaseapp.com',
  projectId: 'couplesync-health',
  messagingSenderId: '135310192337',
  appId: '1:135310192337:web:649ba80febb70c2aeb1ff0',
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification?.title || 'Better Together 💜',
    { body: payload.notification?.body || '', icon: '/favicon.svg', badge: '/favicon.svg' }
  );
});
