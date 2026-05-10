// src/main.js — Application entry point
// ALL window.* at top-level so HTML onclick handlers work immediately.

import { state }           from './state.js';
import { go, injectNavs }  from './ui/nav.js';
import { showToast }       from './ui/toast.js';
import { setupNotifications, requestNotifications } from './ui/notifications.js';

import { pickUser, doLogin, showCode, onLoginSuccess, doLogout }
                           from './screens/login.js';
import { setWorkoutGender, renderWorkout, startTracking,
         stopTracking, togglePause, finishWorkout }
                           from './screens/workout.js';
import { renderGlasses, toggleGlass, addGlass }
                           from './screens/water.js';
import { setWeightTab, recordWeight }
                           from './screens/weight.js';
import { sendChat, sendCheer }
                           from './screens/chat.js';
import { sendAI, aiAsk }   from './screens/ai.js';

import { initAuthListener } from './firebase/auth.js';
import { seedIfNeeded }     from './firebase/firestore.js';
import { renderProgressChart } from './ui/charts.js';

// ── GLOBALS — top-level so onclick="window.go(...)" works instantly ───────────
window.go         = go;
window.showToast  = showToast;

// Auth
window.pickUser   = pickUser;
window.doLogin    = doLogin;
window.showCode   = showCode;
window.doLogout   = doLogout;

// Workout
window.setWkGender     = setWorkoutGender;
window.renderWorkout   = renderWorkout;
window.startWkTracking = startTracking;
window.stopWkTracking  = stopTracking;
window.togglePause     = togglePause;
window.finishWk        = finishWorkout;

// Water
window.renderGlasses   = renderGlasses;
window.toggleGlass     = toggleGlass;
window.addGlass        = addGlass;

// Weight
window.setWtTab  = setWeightTab;
window.recWeight = recordWeight;

// Progress tab toggle
window.setPTab = (el) => {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
};

// Chat
window.doSendChat = sendChat;
window.sendCheer  = sendCheer;

// AI
window.sendAI = sendAI;
window.aiAsk  = aiAsk;

// Notifications — exposed so bell button can trigger it
window.requestNotifications = requestNotifications;

// ── BOOT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Inject bottom navs into bnav-* placeholders (backup — HTML already has hardcoded navs)
  injectNavs();

  // Default UI state
  pickUser('m');
  const pwEl = document.getElementById('lg-pw');
  if (pwEl) pwEl.value = '';

  // Render initial screens
  renderWorkout();
  renderGlasses();

  // Date label
  const dateEl = document.getElementById('wk-date-lbl');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  }

  // Setup notifications (asks for permission if needed)
  setupNotifications().catch(console.warn);

  // Wire bell button on home screen to request notifications
  const bellBtn = document.querySelector('.hm-notif');
  if (bellBtn) {
    bellBtn.style.cursor = 'pointer';
    bellBtn.onclick = () => requestNotifications();
  }

  // Firebase auth — restore session or wait for login
  initAuthListener(onLoginSuccess);
  seedIfNeeded().catch(err => console.warn('[seed]', err.message));
});
