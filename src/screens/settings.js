// src/screens/settings.js
import { state }            from '../state.js';
import { USERS }            from '../config.js';
import { saveDaily }        from '../firebase/db.js';
import { toast }            from '../ui/toast.js';
import { go }               from '../ui/router.js';

const MOODS = [
  { id: 'happy',     label: 'Happy',     emoji: '😊' },
  { id: 'motivated', label: 'Motivated', emoji: '🔥' },
  { id: 'tired',     label: 'Tired',     emoji: '😴' },
  { id: 'stressed',  label: 'Stressed',  emoji: '😤' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'lazy',      label: 'Malas',     emoji: '😪' },
];

export function renderSettings() {
  const u   = state.myUser;
  if (!u) return;

  // Fill user info
  const nameEl   = document.getElementById('set-name');
  const weightEl = document.getElementById('set-weight');
  const heightEl = document.getElementById('set-height');
  const targetEl = document.getElementById('set-target');
  if (nameEl)   nameEl.textContent   = u.name;
  if (weightEl) {
    const wh  = state.weightHistory[state.me];
    const val = wh.find(v => v !== null);
    weightEl.value = val ? val : '';
  }
  if (heightEl) heightEl.value = u.height ?? '';
  if (targetEl) targetEl.value = u.weightTarget ?? '';

  // Calorie goal
  const calEl = document.getElementById('set-calorie');
  if (calEl) calEl.value = state.myData.calorieGoal ?? 1800;

  // Water goal
  const waterEl = document.getElementById('set-water-goal');
  if (waterEl) waterEl.value = state.myData.waterGoal ?? 8;

  // Mood picker
  renderMoodPicker();
}

function renderMoodPicker() {
  const grid = document.getElementById('mood-grid');
  if (!grid) return;
  const current = state.myData.mood;
  grid.innerHTML = MOODS.map(m => `
    <button class="mood-btn ${current === m.id ? 'mood-on' : ''}"
            onclick="window.selectMood('${m.id}')">
      <span class="mood-emoji">${m.emoji}</span>
      <span class="mood-label">${m.label}</span>
    </button>`).join('');
}

export async function selectMood(moodId) {
  state.myData.mood = moodId;
  renderMoodPicker();
  try {
    await saveDaily(state.me, { mood: moodId });
    const m = MOODS.find(x => x.id === moodId);
    toast(`Mood ${m?.emoji} ${m?.label} dicatat!`);
  } catch (e) { toast('Gagal simpan mood'); }
}

export async function saveSettings() {
  const weightVal  = parseFloat(document.getElementById('set-weight')?.value ?? '');
  const calorieVal = parseInt(document.getElementById('set-calorie')?.value ?? '');
  const waterVal   = parseInt(document.getElementById('set-water-goal')?.value ?? '');

  const updates = {};
  if (calorieVal > 0) updates.calorieGoal = calorieVal;
  if (waterVal   > 0) updates.waterGoal   = waterVal;

  try {
    if (Object.keys(updates).length > 0) {
      await saveDaily(state.me, updates);
      Object.assign(state.myData, updates);
    }
    toast('✅ Pengaturan disimpan!');
    go('s-profile');
  } catch (e) {
    toast('Gagal simpan pengaturan');
  }
}
