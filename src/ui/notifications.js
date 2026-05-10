// src/ui/notifications.js
// Manages notification permission UI and badge

export async function setupNotifications() {
  if (!('Notification' in window)) return;

  // Update bell icon state on home screen
  updateBellUI(Notification.permission);

  // If already granted, start reminders silently
  if (Notification.permission === 'granted') {
    const { scheduleDailyReminders, listenForegroundMessages, requestNotificationPermission } =
      await import('../firebase/messaging.js');
    listenForegroundMessages();
    scheduleDailyReminders();
    requestNotificationPermission(); // get FCM token quietly
  }
}

export async function requestNotifications() {
  if (!('Notification' in window)) {
    window.showToast?.('Browser kamu tidak mendukung notifikasi');
    return;
  }

  if (Notification.permission === 'granted') {
    window.showToast?.('✅ Notifikasi sudah aktif!');
    return;
  }

  const { requestNotificationPermission, scheduleDailyReminders, listenForegroundMessages } =
    await import('../firebase/messaging.js');

  const token = await requestNotificationPermission();
  updateBellUI(Notification.permission);

  if (Notification.permission === 'granted') {
    window.showToast?.('🔔 Notifikasi berhasil diaktifkan!');
    listenForegroundMessages();
    scheduleDailyReminders();
    console.log('[Notifications] FCM token:', token);
  } else {
    window.showToast?.('Notifikasi tidak diizinkan. Aktifkan di pengaturan browser.');
  }
}

function updateBellUI(permission) {
  // Bell button on home screen
  const bellBtn  = document.querySelector('.hm-notif');
  const bellDot  = document.querySelector('.hm-notif-dot');
  if (!bellBtn) return;

  if (permission === 'granted') {
    bellBtn.title = 'Notifikasi aktif';
    if (bellDot) bellDot.style.background = '#34D399'; // green dot = active
  } else {
    bellBtn.title = 'Klik untuk aktifkan notifikasi';
    if (bellDot) bellDot.style.background = '#FCA5A5'; // red dot = inactive
  }
}
