// src/screens/notifications.js
import { REMINDERS, VAPID_KEY } from '../config.js';
import { toast } from '../ui/toast.js';

export async function setupNotifications() {
  if (!('Notification' in window)) return;
  updateBellUI();
  if (Notification.permission === 'granted') {
    scheduleReminders();
    listenForeground();
  }
}

export async function requestNotifications() {
  if (!('Notification' in window)) { toast('Browser tidak mendukung notifikasi'); return; }
  if (Notification.permission === 'granted') { toast('✅ Notifikasi sudah aktif!'); return; }

  const perm = await Notification.requestPermission();
  updateBellUI();

  if (perm === 'granted') {
    toast('🔔 Notifikasi berhasil diaktifkan!');
    scheduleReminders();
    listenForeground();
    if (VAPID_KEY) await getFCMToken();
  } else {
    toast('Notifikasi diblokir. Aktifkan di pengaturan browser.');
  }
}

export function showLocalNotif(title, body) {
  if (Notification.permission !== 'granted') return;
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg =>
        reg.showNotification(title, { body, icon: '/favicon.svg', badge: '/favicon.svg', vibrate: [200,100,200] })
      );
    } else {
      new Notification(title, { body, icon: '/favicon.svg' });
    }
  } catch (e) { console.warn('[notif]', e); }
}

function scheduleReminders() {
  const now = new Date();
  REMINDERS.forEach(({ hour, min, title, body }) => {
    const t = new Date(now);
    t.setHours(hour, min, 0, 0);
    if (t <= now) t.setDate(t.getDate() + 1);
    setTimeout(() => showLocalNotif(title, body), t - now);
  });
}

async function listenForeground() {
  try {
    const { getMessaging, onMessage } = await import('firebase/messaging');
    const { app } = await import('../firebase/db.js');
    const msg = getMessaging(app);
    onMessage(msg, payload => {
      const title = payload.notification?.title ?? 'Better Together';
      const body  = payload.notification?.body  ?? '';
      toast(`🔔 ${title}: ${body}`);
    });
  } catch (_) {}
}

async function getFCMToken() {
  try {
    const { getMessaging, getToken } = await import('firebase/messaging');
    const { app } = await import('../firebase/db.js');
    const msg = getMessaging(app);
    const sw  = await navigator.serviceWorker.ready;
    const tok = await getToken(msg, { vapidKey: VAPID_KEY, serviceWorkerRegistration: sw });
    console.log('[FCM] token:', tok);
  } catch (e) { console.warn('[FCM]', e.message); }
}

function updateBellUI() {
  const dot = document.querySelector('.hm-notif-dot');
  if (!dot) return;
  dot.style.background = Notification.permission === 'granted' ? '#34D399' : '#FCA5A5';
}
