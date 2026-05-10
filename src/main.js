// src/main.js  —  Application entry point
// Wires up all modules and exposes globals for HTML onclick handlers

import { state }           from './state.js';
import { go, injectNavs }  from './ui/nav.js';
import { showToast }       from './ui/toast.js';

// Screens
import { pickUser, doLogin, showCode, doLogout, onLoginSuccess }
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

// Firebase
import { initAuthListener, firebaseLogout } from './firebase/auth.js';
import { seedIfNeeded, stopListeners }      from './firebase/firestore.js';

// Charts
import { renderProgressChart } from './ui/charts.js';

// ── Expose globals (required for inline HTML onclick="...") ───────────────────
window.go              = go;
window.showToast       = showToast;

// Login
window.pickUser        = pickUser;
window.doLogin         = doLogin;
window.showCode        = showCode;
window.doLogout        = async () => {
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

// Chart
window.setPTab         = (el) => {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
};

// Chat
window.doSendChat      = sendChat;
window.sendCheer       = sendCheer;

// AI
window.sendAI          = sendAI;
window.aiAsk           = aiAsk;

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Inject bottom navs
  injectNavs();

  // Init UI defaults
  pickUser('m');
  const pwEl = document.getElementById('lg-pw');
  if (pwEl) pwEl.value = '';

  renderWorkout();
  renderGlasses();

  // Date label in workout header
  const dateEl = document.getElementById('wk-date-lbl');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  }

  // Firebase: restore session + seed
  initAuthListener(onLoginSuccess);
  seedIfNeeded().catch(console.warn);
});
