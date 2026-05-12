// src/screens/workout.js
import { state }                 from '../state.js';
import { WORKOUTS, USERS }       from '../config.js';
import { saveWorkout }           from '../firebase/db.js';
import { toast, statusBar }      from '../ui/toast.js';
import { go }                    from '../ui/router.js';

export function renderWorkoutScreen() {
  const plan = WORKOUTS[state.workoutGender];
  if (!plan) return;

  setText('wk-title',  plan.title);
  setText('wk-desc',   plan.desc);
  setText('wk-b1',     plan.badge1);
  setText('wk-b2',     plan.badge2);

  const hero = document.getElementById('wk-hero');
  if (hero) hero.style.background = plan.gradient;

  const startBtn = document.getElementById('wk-start-btn');
  if (startBtn) {
    startBtn.style.background = plan.gradient;
    startBtn.style.boxShadow  = `0 8px 24px ${plan.accent}55`;
  }

  const list = document.getElementById('wk-exlist');
  if (!list) return;
  list.innerHTML = plan.exercises.map((e, i) => `
    <div class="ex-row">
      <div class="ex-num" style="background:${plan.accentBg};color:${plan.accent}">${i + 1}</div>
      <div class="ex-info" style="flex:1">
        <span class="ex-name">${e.name}</span>
        <span class="ex-detail">${e.sets} × ${e.reps} ${e.unit}</span>
      </div>
      <span class="ex-chip" style="background:${plan.accentBg};color:${plan.accent}">
        ${e.sets}×${e.reps}
      </span>
    </div>`).join('');
}

export function setWorkoutGender(gender) {
  state.workoutGender = gender;
  const mBtn = document.getElementById('wkg-m');
  const fBtn = document.getElementById('wkg-f');
  if (mBtn) mBtn.className = 'wk-toggle-btn m' + (gender === 'male'   ? ' on' : '');
  if (fBtn) fBtn.className = 'wk-toggle-btn f' + (gender === 'female' ? ' on' : '');
  renderWorkoutScreen();
}

export function startWorkoutTracking() {
  const plan = WORKOUTS[state.workoutGender];
  const ex0  = plan.exercises[0];
  const ex1  = plan.exercises[1];

  setText('wkt-name',     plan.title);
  setText('wkt-ex-name',  ex0.name);
  setText('wkt-ex-detail',`${ex0.sets} × ${ex0.reps} ${ex0.unit}`);
  setText('wkt-ring-txt', `${ex0.sets}×${ex0.reps}`);
  if (ex1) setText('wkt-next-name', `${ex1.name} — ${ex1.sets}×${ex1.reps} ${ex1.unit}`);

  state.timerSec = 0;
  state.isPaused = false;
  clearInterval(state.timerIv);

  state.timerIv = setInterval(() => {
    if (!state.isPaused) {
      state.timerSec++;
      const m = String(Math.floor(state.timerSec / 60)).padStart(2, '0');
      const s = String(state.timerSec % 60).padStart(2, '0');
      setText('wkt-clock', `${m}:${s}`);
    }
  }, 1000);

  go('s-wkt');
}

export function stopWorkoutTracking() {
  clearInterval(state.timerIv);
  state.timerIv = null;
  go('s-workout');
}

export function togglePause() {
  state.isPaused = !state.isPaused;
  const ic  = document.getElementById('pause-ic');
  const txt = document.getElementById('pause-txt');
  if (!ic || !txt) return;
  if (state.isPaused) {
    ic.innerHTML   = '<polygon points="5 3 19 12 5 21 5 3" fill="#7C3AED"/>';
    txt.textContent = 'Lanjut';
  } else {
    ic.innerHTML   = '<rect x="6" y="4" width="4" height="16" rx="1" fill="#7C3AED"/><rect x="14" y="4" width="4" height="16" rx="1" fill="#7C3AED"/>';
    txt.textContent = 'Pause';
  }
}

export async function finishWorkout() {
  clearInterval(state.timerIv);
  state.timerIv = null;
  state.myData.workoutDone = true;
  state.myData.workoutDurationSec = state.timerSec;

  statusBar('Menyimpan workout…');
  try {
    const plan = WORKOUTS[state.workoutGender];
    await saveWorkout(state.me, plan.title, state.timerSec);
    statusBar('Workout tersimpan! 🎉', true);
    toast(`🎉 Workout selesai! ${Math.round(state.timerSec / 60)} menit. +20 XP`);
  } catch (err) {
    console.error(err);
    statusBar('Tersimpan offline', null);
    toast('Workout selesai! (mode offline)');
  }

  setTimeout(() => go('s-home'), 700);
}

// ── helper ────────────────────────────────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
