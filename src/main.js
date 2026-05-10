// src/main.js — Application entry point
// ALL window.* assignments are at top-level (not inside DOMContentLoaded)
// so they are available immediately when HTML onclick handlers fire.

import { state }          from './state.js';
import { go, injectNavs } from './ui/nav.js';
import { showToast }      from './ui/toast.js';

import { pickUser, doLogin, showCode, onLoginSuccess }
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
import { sendAI, aiAsk }  from './screens/ai.js';

import { initAuthListener, firebaseLogout } from './firebase/auth.js';
import { seedIfNeeded, stopListeners }      from './firebase/firestore.js';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBALS — must be at top-level so HTML onclick="go(...)" works immediately
// ─────────────────────────────────────────────────────────────────────────────

window.go         = go;
window.showToast  = showToast;

// Login / Auth
window.pickUser   = pickUser;
window.doLogin    = doLogin;
window.showCode   = showCode;
window.doLogout   = async () => {
  stopListeners();
  await firebaseLogout();
  showToast('Sampai jumpa! 💜');
  setTimeout(() => go('s-splash'), 900);
};

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
window.setWtTab        = setWeightTab;
window.recWeight       = recordWeight;

// Progress tab
window.setPTab = (el) => {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
};

// Chat
window.doSendChat  = sendChat;
window.sendCheer   = sendCheer;

// AI Coach
window.sendAI      = sendAI;
window.aiAsk       = aiAsk;

// ─────────────────────────────────────────────────────────────────────────────
// BOOT — runs after DOM is ready
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Build bottom navs
  injectNavs();

  // Default UI state
  pickUser('m');
  const pwEl = document.getElementById('lg-pw');
  if (pwEl) pwEl.value = '';

  // Render initial screens
  renderWorkout();
  renderGlasses();

  // Set today's date label
  const dateEl = document.getElementById('wk-date-lbl');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  }

  // Firebase: restore existing session + seed initial data
  initAuthListener(onLoginSuccess);
  seedIfNeeded().catch(err => console.warn('[seed]', err.message));
});
