// src/screens/workout.js

import { state }       from '../state.js';
import { go }          from '../ui/nav.js';
import { showToast, fbBar } from '../ui/toast.js';
import { WORKOUT_PLANS }   from '../data/workouts.js';
import { saveWorkout } from '../firebase/firestore.js';

export function setWorkoutGender(gender) {
  state.workoutGender = gender;
  document.getElementById('wkg-m').className = 'wkt-btn2 m' + (gender === 'm' ? ' on' : '');
  document.getElementById('wkg-f').className = 'wkt-btn2 f' + (gender === 'f' ? ' on' : '');
  renderWorkout();
}

export function renderWorkout() {
  const plan = WORKOUT_PLANS[state.workoutGender];

  document.getElementById('wk-title').textContent = plan.title;
  document.getElementById('wk-desc').textContent  = plan.desc;
  document.getElementById('wk-b1').textContent    = plan.badge1;
  document.getElementById('wk-b2').textContent    = plan.badge2;
  document.getElementById('wk-hero').style.background = plan.gradient;

  const list = document.getElementById('wk-exlist');
  list.innerHTML = '<div class="sect">Latihan Hari Ini</div>' +
    plan.exercises.map((e, i) => `
      <div class="ex-row">
        <div class="ex-n" style="background:${plan.accentLight};color:${plan.accentColor}">${i + 1}</div>
        <div class="ex-info" style="flex:1">
          <span>${e.name}</span>
          <p>${e.detail}</p>
        </div>
        <span class="ex-chip" style="background:${plan.accentLight};color:${plan.accentColor}">
          ${e.detail.split(' ')[0]}
        </span>
      </div>`).join('');

  const btn = document.getElementById('wk-start-btn');
  btn.className = 'btn-primary' + (state.workoutGender === 'f' ? ' btn-pink' : '');
}

export function startTracking() {
  const plan = WORKOUT_PLANS[state.workoutGender];
  document.getElementById('wkt-sname').textContent   = plan.title;
  document.getElementById('wkt-ex-n').textContent    = plan.exercises[0].name;
  document.getElementById('wkt-ex-r').textContent    = plan.exercises[0].detail;
  document.getElementById('wkt-ring-txt').textContent = plan.exercises[0].detail.split(' × ')[0] || '1';
  if (plan.exercises[1]) {
    document.getElementById('wkt-next-n').textContent =
      `${plan.exercises[1].name} — ${plan.exercises[1].detail}`;
  }

  state.timerSec  = 0;
  state.isPaused  = false;
  clearInterval(state.timerInterval);

  state.timerInterval = setInterval(() => {
    if (!state.isPaused) {
      state.timerSec++;
      const m = String(Math.floor(state.timerSec / 60)).padStart(2, '0');
      const s = String(state.timerSec % 60).padStart(2, '0');
      const el = document.getElementById('wkt-clock');
      if (el) el.textContent = `${m}:${s}`;
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
  const ic  = document.getElementById('pause-ic');
  const txt = document.getElementById('pause-txt');
  if (!ic || !txt) return;

  if (state.isPaused) {
    ic.innerHTML    = '<polygon points="5 3 19 12 5 21 5 3" fill="#7C3AED"/>';
    txt.textContent = 'Lanjut';
  } else {
    ic.innerHTML    = '<rect x="6" y="4" width="4" height="16" rx="1" fill="#7C3AED"/><rect x="14" y="4" width="4" height="16" rx="1" fill="#7C3AED"/>';
    txt.textContent = 'Pause';
  }
}

export async function finishWorkout() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;

  fbBar('Menyimpan workout…');
  try {
    const plan = WORKOUT_PLANS[state.workoutGender];
    await saveWorkout(state.currentUser, plan.title, state.timerSec);
    fbBar('Workout tersimpan! 🎉', true);
  } catch (err) {
    console.error('[finishWorkout]', err);
    fbBar('Tersimpan offline', null);
  }

  showToast('🎉 Workout selesai! +20 XP');
  setTimeout(() => go('s-home'), 600);
}
