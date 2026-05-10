// src/firebase/firestore.js
// All Firestore read/write operations

import {
  getDoc, setDoc, addDoc, updateDoc, getDocs,
  query, orderBy, limit, onSnapshot,
  serverTimestamp, increment,
} from 'firebase/firestore';
import { ref, today } from './refs.js';
import { state }      from '../state.js';
import { updateUI }   from '../ui/updater.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

export async function getLatestWeight(role) {
  try {
    const q    = query(ref.weights(role), orderBy('createdAt', 'desc'), limit(2));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const [a, b] = snap.docs;
    const last   = a.data();
    const prev   = b ? b.data() : last;
    return { kg: last.kg, diff: parseFloat((last.kg - prev.kg).toFixed(1)) };
  } catch {
    return null;
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function loadDashboard() {
  try {
    const [snapDm, snapDf, wm, wf, couple] = await Promise.all([
      getDoc(ref.daily('m', today())),
      getDoc(ref.daily('f', today())),
      getLatestWeight('m'),
      getLatestWeight('f'),
      getDoc(ref.couple()),
    ]);

    const dm = snapDm.exists() ? snapDm.data() : {};
    const df = snapDf.exists() ? snapDf.data() : {};

    // Sync waterCount to state
    state.waterCount = state.currentUser === 'm' ? (dm.water ?? 6) : (df.water ?? 6);

    // Sync latest weights into local cache
    if (wm) { state.weightData.m.push(wm.kg); state.weightData.m.shift(); }
    if (wf) { state.weightData.f.push(wf.kg); state.weightData.f.shift(); }

    // Streak
    if (couple.exists()) state.streak = couple.data().streak ?? 12;

    // Health context for AI
    state.healthCtx = buildHealthCtx(dm, df, wm, wf, couple.exists() ? couple.data() : {});

    // Refresh all UI elements
    updateUI.dashboard(wm, wf, couple.exists() ? couple.data() : {});
    updateUI.aiContext(wm, wf, couple.exists() ? couple.data() : {});

  } catch (err) {
    console.error('[loadDashboard]', err);
  }
}

function buildHealthCtx(dm, df, wm, wf, couple) {
  return `Data real-time dari Firebase:
- Ilham  : ${wm ? wm.kg + ' kg' : '68.7 kg'}, workout: ${dm.workoutDone ? '✅' : '❌'}, air: ${dm.water ?? 6}/8
- Navisa : ${wf ? wf.kg + ' kg' : '55.2 kg'}, workout: ${df.workoutDone ? '✅' : '❌'}, air: ${df.water ?? 6}/8
- Streak bersama: ${couple.streak ?? 12} hari`;
}

// ── Water ─────────────────────────────────────────────────────────────────────

export async function saveWater(count) {
  try {
    await setDoc(
      ref.daily(state.currentUser, today()),
      { water: count, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error('[saveWater]', err);
  }
}

// ── Weight ────────────────────────────────────────────────────────────────────

export async function saveWeight(role, kg) {
  // Anti-cheat: check last entry
  try {
    const q    = query(ref.weights(role), orderBy('createdAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const prev = snap.docs[0].data().kg;
      if (Math.abs(kg - prev) > 3) throw new Error('EXTREME_CHANGE');
    }
  } catch (err) {
    if (err.message === 'EXTREME_CHANGE') throw err;
    // Network error — allow save offline
  }

  await addDoc(ref.weights(role), { kg, date: today(), createdAt: serverTimestamp() });
}

// ── Workout ───────────────────────────────────────────────────────────────────

export async function saveWorkout(role, title, durationSec) {
  await addDoc(ref.workouts(role), { title, durationSec, date: today(), completedAt: serverTimestamp() });
  await setDoc(ref.daily(role, today()), { workoutDone: true, updatedAt: serverTimestamp() }, { merge: true });

  // Bump streak if partner also done
  const partnerRole = role === 'm' ? 'f' : 'm';
  const partnerSnap = await getDoc(ref.daily(partnerRole, today()));
  if (partnerSnap.exists() && partnerSnap.data().workoutDone) {
    await updateDoc(ref.couple(), { streak: increment(1), lastStreakDate: today() });
  }
}

// ── Chat ──────────────────────────────────────────────────────────────────────

let chatUnsub = null;

export function startChatListener() {
  if (chatUnsub) chatUnsub();
  const q = query(ref.chat(), orderBy('createdAt', 'asc'), limit(60));
  chatUnsub = onSnapshot(q, (snap) => {
    if (snap.empty) return;
    updateUI.chat(snap);
  }, (err) => console.error('[chatListener]', err));
}

export async function sendChatMessage(text) {
  await addDoc(ref.chat(), { text, sender: state.currentUser, createdAt: serverTimestamp() });
}

// ── Partner listener ──────────────────────────────────────────────────────────

let partnerUnsub = null;

export function startPartnerListener() {
  if (partnerUnsub) partnerUnsub();
  const partnerRole = state.currentUser === 'm' ? 'f' : 'm';
  partnerUnsub = onSnapshot(ref.daily(partnerRole, today()), (snap) => {
    if (!snap.exists()) return;
    updateUI.partnerStatus(snap.data());
  }, (err) => console.error('[partnerListener]', err));
}

export function stopListeners() {
  if (chatUnsub)    chatUnsub();
  if (partnerUnsub) partnerUnsub();
  chatUnsub = null;
  partnerUnsub = null;
}

// ── First-time seed ───────────────────────────────────────────────────────────

export async function seedIfNeeded() {
  try {
    const snap = await getDoc(ref.couple());
    if (!snap.exists()) {
      await setDoc(ref.couple(), {
        userA: 'ilham', userB: 'navisa',
        streak: 12, lastStreakDate: today(),
        createdAt: serverTimestamp(),
      });
      await addDoc(ref.weights('m'), { kg: 68.7, date: today(), createdAt: serverTimestamp() });
      await addDoc(ref.weights('f'), { kg: 55.2, date: today(), createdAt: serverTimestamp() });
      console.log('[seed] Firestore initialised');
    }
  } catch (err) {
    console.warn('[seed]', err.message);
  }
}
