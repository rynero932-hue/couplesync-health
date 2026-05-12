// src/screens/habits.js
import { state }       from '../state.js';
import { HABITS }      from '../config.js';
import { saveHabit }   from '../firebase/db.js';
import { toast }       from '../ui/toast.js';

export function renderHabits() {
  const el = document.getElementById('habits-list');
  if (!el) return;

  const myDone  = state.myData.habits      || {};
  const pDone   = state.partnerData.habits || {};
  const myName  = state.myUser?.name      ?? 'Kamu';
  const pName   = state.partnerUser?.name ?? 'Dia';

  el.innerHTML = HABITS.map(h => {
    const iDone = !!myDone[h.id];
    const pDoneH = !!pDone[h.id];
    return `
    <div class="habit-row" id="habit-${h.id}">
      <button class="habit-check ${iDone ? 'done' : ''}"
              onclick="window.toggleHabit('${h.id}')"
              aria-label="Toggle ${h.label}">
        ${iDone ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : ''}
      </button>
      <div class="habit-info">
        <span class="habit-label ${iDone ? 'done-text' : ''}">${h.icon} ${h.label}</span>
        <div class="habit-partner-row">
          <span class="habit-who ${iDone ? 'who-done' : 'who-todo'}">${myName}: ${iDone ? '✅' : '○'}</span>
          <span class="habit-who ${pDoneH ? 'who-done' : 'who-todo'}">${pName}: ${pDoneH ? '✅' : '○'}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  updateHabitProgress();
}

export async function toggleHabit(habitId) {
  const current = !!state.myData.habits?.[habitId];
  const newVal  = !current;

  // Optimistic update
  if (!state.myData.habits) state.myData.habits = {};
  state.myData.habits[habitId] = newVal;
  renderHabits();

  try {
    await saveHabit(habitId, newVal);
    if (newVal) toast(`✅ ${HABITS.find(h => h.id === habitId)?.label ?? habitId} selesai! +5 XP`);
  } catch (err) {
    // Rollback
    state.myData.habits[habitId] = current;
    renderHabits();
    toast('Gagal simpan, coba lagi');
  }
}

function updateHabitProgress() {
  const habits = state.myData.habits || {};
  const done   = HABITS.filter(h => habits[h.id]).length;
  const pct    = Math.round(done / HABITS.length * 100);

  const pctEl = document.getElementById('habit-pct');
  const cntEl = document.getElementById('habit-count');
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (cntEl) cntEl.textContent = `${done}/${HABITS.length} selesai`;
}
