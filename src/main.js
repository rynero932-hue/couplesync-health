// src/main.js — entry point
// ALL window.* at top-level so onclick="window.X()" always works.

import { go }            from './ui/router.js';
import { toast }         from './ui/toast.js';
import { renderProgressChart } from './ui/charts.js';

import { pickUser, showCode, doLogin, doLogout, switchUser, initAuthListener }
                         from './screens/auth.js';
import { setWorkoutGender, renderWorkoutScreen, startWorkoutTracking,
         stopWorkoutTracking, togglePause, finishWorkout }
                         from './screens/workout.js';
import { renderGlasses, toggleGlass, addGlass }
                         from './screens/water.js';
import { setWeightTab, recordWeight }
                         from './screens/weight.js';
import { toggleHabit }   from './screens/habits.js';
import { sendChat, sendCheer } from './screens/chat.js';
import { sendAI, aiAsk } from './screens/ai.js';
import { setupNotifications, requestNotifications } from './screens/notifications.js';

// ── Globals ───────────────────────────────────────────────────────────────────
window.go          = go;
window.showToast   = toast;

// Auth
window.pickUser    = pickUser;
window.showCode    = showCode;
window.doLogin     = doLogin;
window.doLogout    = doLogout;
window.switchUser  = switchUser;

// Workout
window.setWkGender        = setWorkoutGender;
window.renderWorkout      = renderWorkoutScreen;
window.startWkTracking    = startWorkoutTracking;
window.stopWkTracking     = stopWorkoutTracking;
window.togglePause        = togglePause;
window.finishWk           = finishWorkout;

// Water
window.renderGlasses      = renderGlasses;
window.toggleGlass        = toggleGlass;
window.addGlass           = addGlass;

// Weight
window.setWtTab           = setWeightTab;
window.recWeight          = recordWeight;

// Habits
window.toggleHabit        = toggleHabit;

// Progress
window.setPTab = el => {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  renderProgressChart();
};

// Chat
window.doSendChat         = sendChat;
window.sendCheer          = sendCheer;

// AI
window.sendAI             = sendAI;
window.aiAsk              = aiAsk;

// Notifications
window.requestNotifications = requestNotifications;

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Default state
  document.getElementById('lg-pw').value = '';
  pickUser('m');

  // Date label
  const dateEl = document.getElementById('wk-date-lbl');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  }

  // Notification bell
  const bell = document.querySelector('.hm-notif');
  if (bell) bell.addEventListener('click', requestNotifications);

  // Setup notifications silently
  setupNotifications().catch(console.warn);

  // Firebase session restore
  initAuthListener();
});
