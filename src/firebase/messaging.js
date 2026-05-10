// src/firebase/messaging.js
// Push Notifications via Firebase Cloud Messaging (FCM)
// Requires VAPID key from Firebase Console → Project Settings → Cloud Messaging

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './config.js';

// VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
// Replace with your actual VAPID key
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

let messaging = null;

function getMsg() {
  if (!messaging) messaging = getMessaging(app);
  return messaging;
}

/**
 * Request notification permission and get FCM token.
 * Returns the FCM token string, or null if denied/unsupported.
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[FCM] Notifications not supported in this browser');
    return null;
  }

  if (Notification.permission === 'denied') {
    console.warn('[FCM] Notifications denied by user');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Permission not granted:', permission);
      return null;
    }

    if (!VAPID_KEY) {
      console.warn('[FCM] No VAPID key configured — skipping FCM token fetch');
      return null;
    }

    const token = await getToken(getMsg(), {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    console.log('[FCM] Token:', token);
    return token;

  } catch (err) {
    console.warn('[FCM] Error getting token:', err.message);
    return null;
  }
}

/**
 * Listen for foreground messages (when app is open).
 * Shows a toast notification.
 */
export function listenForegroundMessages() {
  try {
    onMessage(getMsg(), (payload) => {
      console.log('[FCM] Foreground message:', payload);
      const title = payload.notification?.title || 'Better Together';
      const body  = payload.notification?.body  || '';
      if (window.showToast) {
        window.showToast(`🔔 ${title}: ${body}`);
      }
    });
  } catch (err) {
    console.warn('[FCM] onMessage error:', err.message);
  }
}

/**
 * Show a local browser notification (no FCM server needed).
 * Works offline, great for reminders.
 */
export function showLocalNotification(title, body, icon = '/favicon.svg') {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, { body, icon, badge: '/favicon.svg', vibrate: [200, 100, 200] });
    });
  } else {
    new Notification(title, { body, icon });
  }
}

/**
 * Schedule daily reminder notifications.
 * Uses setTimeout — resets when app is opened.
 */
export function scheduleDailyReminders() {
  if (Notification.permission !== 'granted') return;

  const now     = new Date();
  const reminders = [
    { hour: 8,  min: 0,  title: '💧 Waktu minum air!',    body: 'Jangan lupa target 8 gelas hari ini, Ilham & Navisa!' },
    { hour: 12, min: 0,  title: '🍗 Waktu makan siang!',  body: 'Pilih makanan sehat ya. Kalian bisa!' },
    { hour: 18, min: 0,  title: '💪 Waktunya workout!',   body: 'Jaga streak kalian bersama. Semangat!' },
    { hour: 21, min: 0,  title: '🌙 Reminder tidur!',     body: 'Tidur cukup penting untuk recovery. Good night!' },
  ];

  reminders.forEach(({ hour, min, title, body }) => {
    const target  = new Date(now);
    target.setHours(hour, min, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1); // schedule for tomorrow if past
    const delay = target - now;
    setTimeout(() => showLocalNotification(title, body), delay);
  });

  console.log('[FCM] Daily reminders scheduled');
}
