// src/screens/workout.js

import { state }            from '../state.js';
import { go }               from '../ui/nav.js';
import { showToast, fbBar } from '../ui/toast.js';
import { WORKOUT_PLANS }    from '../data/workouts.js';

async function persistWorkout(role, title, durationSec) {
  try {
    const { saveWorkout } = await import('../firebase/firestore.js');
    await saveWorkout(role, title, durationSec);
  } catch (e) { console.warn('[workout] offline:', e.message); }
}

export function setWorkoutGender(gender) {
  state.workoutGender = gender;
  const mBtn = document.getElementById('wkg-m');
  const fBtn = document.getElementById('wkg-f');
  if (mBtn) mBtn.className = 'wkt-btn2 m' + (gender === 'm' ? ' on' : '');
  if (fBtn) fBtn.className = 'wkt-btn2 f' + (gender === 'f' ? ' on' : '');
  renderWorkout();
}

export function renderWorkout() {
  const plan = WORKOUT_PLANS[state.workoutGender];
  if (!plan) return;

  const titleEl = document.getElementById('wk-title');
  const descEl  = document.getElementById('wk-desc');
  const b1El    = document.getElementById('wk-b1');
  const b2El    = document.getElementById('wk-b2');
  const heroEl  = document.getElementById('wk-hero');
  const listEl  = document.getElementById('wk-exlist');
  const startBtn = document.getElementById('wk-start-btn');

  if (titleEl)  titleEl.textContent = plan.title;
  if (descEl)   descEl.textContent  = plan.desc;
  if (b1El)     b1El.textContent    = plan.badge1;
  if (b2El)     b2El.textContent    = plan.badge2;
  if (heroEl)   heroEl.style.background = plan.gradient;

  if (listEl) {
    listEl.innerHTML = '<div class="sect">Latihan Hari Ini</div>' +
      plan.exercises.map((e, i) => `
        <div class="ex-row">
          <div class="ex-n" style="background:${plan.accentLight};color:${plan.accentColor}">${i + 1}</div>
          <div class="ex-info" style="flex:1">
            <span>${e.name}</span><p>${e.detail}</p>
          </div>
          <span class="ex-chip" style="background:${plan.accentLight};color:${plan.accentColor}">
            ${e.detail.split(' ')[0]}
          </span>
        </div>`).join('');
  }

  if (startBtn) {
    startBtn.className = 'btn-primary' + (state.workoutGender === 'f' ? ' btn-pink' : '');
  }
}

export function startTracking() {
  const plan = WORKOUT_PLANS[state.workoutGender];
  if (!plan) return;

  const snameEl  = document.getElementById('wkt-sname');
  const exNEl    = document.getElementById('wkt-ex-n');
  const exREl    = document.getElementById('wkt-ex-r');
  const ringTxt  = document.getElementById('wkt-ring-txt');
  const nextNEl  = document.getElementById('wkt-next-n');

  if (snameEl) snameEl.textContent   = plan.title;
  if (exNEl)   exNEl.textContent     = plan.exercises[0].name;
  if (exREl)   exREl.textContent     = plan.exercises[0].detail;
  if (ringTxt) ringTxt.textContent   = plan.exercises[0].detail.split(' × ')[0] || '1';
  if (nextNEl && plan.exercises[1]) {
    nextNEl.textContent = `${plan.exercises[1].name} — ${plan.exercises[1].detail}`;
  }

  state.timerSec  = 0;
  state.isPaused  = false;
  clearInterval(state.timerInterval);

  state.timerInterval = setInterval(() => {
    if (!state.isPaused) {
      state.timerSec++;
      const m = String(Math.floor(state.timerSec / 60)).padStart(2, '0');
      const s = String(state.timerSec % 60).padStart(2, '0');
      const clockEl = document.getElementById('wkt-clock');
      if (clockEl) clockEl.textContent = `${m}:${s}`;
    }
  }, 1000);

  go('s-wkt');
}

export function stopTracking() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  go('s-workout');
}

export function togglePause() {
  state.isPaused = !state.isPaused;
  const icEl  = document.getElementById('pause-ic');
  const txtEl = document.getElementById('pause-txt');
  if (!icEl || !txtEl) return;
  if (state.isPaused) {
    icEl.innerHTML   = '<polygon points="5 3 19 12 5 21 5 3" fill="#7C3AED"/>';
    txtEl.textContent = 'Lanjut';
  } else {
    icEl.innerHTML   = '<rect x="6" y="4" width="4" height="16" rx="1" fill="#7C3AED"/><rect x="14" y="4" width="4" height="16" rx="1" fill="#7C3AED"/>';
    txtEl.textContent = 'Pause';
  }
}

export async function finishWorkout() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  fbBar('Menyimpan workout…');
  try {
    const plan = WORKOUT_PLANS[state.workoutGender];
    await persistWorkout(state.currentUser, plan.title, state.timerSec);
    fbBar('Workout tersimpan! 🎉', true);
  } catch (err) {
    console.error('[finishWorkout]', err);
    fbBar('Tersimpan offline', null);
  }
  showToast('🎉 Workout selesai! +20 XP');
  setTimeout(() => go('s-home'), 600);
}
