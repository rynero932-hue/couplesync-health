// src/screens/home.js
import { state }        from '../state.js';
import { USERS, HABITS } from '../config.js';
import { loadDashboard, listenPartnerDaily } from '../firebase/db.js';
import { statusBar }    from '../ui/toast.js';

export async function initHome() {
  statusBar('Memuat data…');
  const data = await loadDashboard();
  if (data) {
    statusBar('Data dimuat ✓', true);
    refreshHome();
    listenPartnerDaily(onPartnerUpdate);
  }
}

export function refreshHome() {
  updateMyCards();
  updatePartnerFeed();
  updateStreak();
  updateAIContext();
}

function updateMyCards() {
  const u  = state.myUser;
  const d  = state.myData;
  const wh = state.weightHistory[state.me];
  const kg = wh[wh.length - 1];

  setText('hm-greet', greeting(u.name));
  setText('hm-water-val', `${d.water ?? 0}/8`);
  setText('hm-wt-me',  kg ? `${kg} kg` : '—');
  setText('hm-streak', state.streak);
  setText('streak-big', state.streak);

  // Habit ring
  const total = HABITS.length;
  const done  = Object.values(d.habits || {}).filter(Boolean).length;
  const pct   = Math.round(done / total * 100);
  setText('hm-habit-pct', `${pct}%`);
  const ring = document.getElementById('hm-habit-ring');
  if (ring) {
    const c = 2 * Math.PI * 22;
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c - (c * pct / 100);
  }

  // Workout badge
  const wkBadge = document.getElementById('hm-wk-badge');
  if (wkBadge) {
    wkBadge.textContent   = d.workoutDone ? '✅ Selesai' : 'Belum';
    wkBadge.className     = 'badge ' + (d.workoutDone ? 'badge-green' : 'badge-gray');
  }
}

function updatePartnerFeed() {
  const pu    = state.partnerUser;
  const pd    = state.partnerData;
  const el    = document.getElementById('partner-feed');
  if (!el || !pu) return;

  const activities = [];

  // Workout
  if (pd.workoutDone) {
    const mins = pd.workoutDurationSec ? Math.round(pd.workoutDurationSec / 60) : '?';
    activities.push({ icon: '💪', text: `${pu.name} selesai workout ${mins} menit!`, time: 'hari ini', cls: 'feed-green' });
  }

  // Water
  if ((pd.water ?? 0) > 0) {
    activities.push({ icon: '💧', text: `${pu.name} sudah minum ${pd.water}/8 gelas`, time: 'hari ini', cls: 'feed-blue' });
  }

  // Habits
  const doneHabits = HABITS.filter(h => pd.habits?.[h.id]);
  if (doneHabits.length > 0) {
    activities.push({ icon: '✅', text: `${pu.name} selesaikan ${doneHabits.length} habit`, time: 'hari ini', cls: 'feed-purple' });
  }

  // Mood
  const MOODS = { happy:'😊 Happy', motivated:'🔥 Motivated', tired:'😴 Tired', stressed:'😤 Stressed', energetic:'⚡ Energetic' };
  if (pd.mood) {
    activities.push({ icon: '💜', text: `Mood ${pu.name}: ${MOODS[pd.mood] ?? pd.mood}`, time: '', cls: 'feed-pink' });
  }

  if (activities.length === 0) {
    el.innerHTML = `<div class="feed-empty">Belum ada aktivitas ${pu.name} hari ini 🌙</div>`;
    return;
  }

  el.innerHTML = activities.map(a => `
    <div class="feed-item ${a.cls}">
      <span class="feed-icon">${a.icon}</span>
      <div class="feed-body">
        <span class="feed-text">${a.text}</span>
        ${a.time ? `<span class="feed-time">${a.time}</span>` : ''}
      </div>
    </div>`).join('');
}

function updateStreak() {
  setText('hm-streak', state.streak);
  setText('streak-big', state.streak);
  setText('prof-streak', state.streak);
}

function updateAIContext() {
  const me  = state.myData;
  const pd  = state.partnerData;
  const wm  = state.weightHistory.m;
  const wf  = state.weightHistory.f;
  state.healthCtx = `Data real-time:
Ilham: ${wm[wm.length-1]}kg, workout:${state.me==='m'?me.workoutDone:pd.workoutDone?'✅':'❌'}, air:${state.me==='m'?me.water:pd.water}/8
Navisa: ${wf[wf.length-1]}kg, workout:${state.me==='f'?me.workoutDone:pd.workoutDone?'✅':'❌'}, air:${state.me==='f'?me.water:pd.water}/8
Streak bersama: ${state.streak} hari`;

  const chips = document.getElementById('ai-ctx-chips');
  if (chips) {
    const myu = state.myUser;
    chips.innerHTML = `
      <span class="ctx-chip">${myu.name}: ${state.me==='m'?wm[wm.length-1]:wf[wf.length-1]}kg</span>
      <span class="ctx-chip">Streak ${state.streak}hr</span>
      <span class="ctx-chip">Air ${me.water ?? 0}/8</span>
      <span class="ctx-chip">Workout ${me.workoutDone?'✅':'❌'}</span>`;
  }
}

export function onPartnerUpdate(data) {
  Object.assign(state.partnerData, data);
  updatePartnerFeed();
  updateAIContext();

  // Show notification if partner just finished workout
  if (data.workoutDone && !state._partnerWkNotified) {
    state._partnerWkNotified = true;
    const name = state.partnerUser?.name ?? 'Pasanganmu';
    window.showToast?.(`🎉 ${name} baru saja selesai workout!`);
    if (Notification.permission === 'granted') {
      new Notification(`💪 ${name} selesai workout!`, {
        body: 'Kasih semangat dia yuk!',
        icon: '/favicon.svg',
      });
    }
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function greeting(name) {
  const h = new Date().getHours();
  const g = h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam';
  return `Halo, ${name}! 👋`;
}
