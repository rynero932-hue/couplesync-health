// src/firebase/db.js
import { initializeApp }    from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc,
         collection, query, orderBy, limit, onSnapshot, getDocs,
         serverTimestamp, increment }  from 'firebase/firestore';
import { FB_CONFIG, COUPLE_ID, USERS } from '../config.js';
import { state, setUser }              from '../state.js';

// ── Init ──────────────────────────────────────────────────────────────────────
let app, auth, db;

try {
  if (!FB_CONFIG.apiKey) {
    throw new Error('Firebase API Key missing. Please set Environment Variables in Vercel.');
  }
  app  = initializeApp(FB_CONFIG);
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (err) {
  console.error('[Firebase Init Error]', err.message);
  // Fallback dummy objects to prevent crashes on reference
  auth = { onAuthStateChanged: () => {} };
  db   = {}; 
}

// ── Refs ──────────────────────────────────────────────────────────────────────
export const today   = () => new Date().toISOString().split('T')[0];
const rCouple        = () => doc(db, 'couples', COUPLE_ID);
const rDaily         = (role, d) => doc(db, 'daily', `${role}_${d}`);
const rWeights       = (role)    => collection(db, `weights_${role}`);
const rWorkouts      = (role)    => collection(db, `workouts_${role}`);
const rChat          = ()        => collection(db, 'chats', COUPLE_ID, 'messages');

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function fbLogin(role, password) {
  return signInWithEmailAndPassword(auth, USERS[role].email, password);
}

export async function fbLogout() {
  stopListeners();
  return signOut(auth);
}

let _authCb = null;
export function listenAuth(cb) {
  _authCb = cb;
  return onAuthStateChanged(auth, async user => {
    if (!user) return;
    const role = user.email === USERS.m.email ? 'm' : 'f';
    cb(role);
  });
}

// ── Listeners ─────────────────────────────────────────────────────────────────
let _unsubChat    = null;
let _unsubPartner = null;

export function stopListeners() {
  _unsubChat?.();
  _unsubPartner?.();
  _unsubChat = _unsubPartner = null;
}

export function listenChat(cb) {
  _unsubChat?.();
  const q = query(rChat(), orderBy('createdAt', 'asc'), limit(60));
  _unsubChat = onSnapshot(q, snap => cb(snap), err => console.error('[chat]', err));
}

export function listenPartnerDaily(cb) {
  _unsubPartner?.();
  const role = state.partner;
  if (!role) return;
  _unsubPartner = onSnapshot(rDaily(role, today()), snap => {
    if (snap.exists()) cb(snap.data());
  }, err => console.error('[partner]', err));
}

// ── Dashboard load ────────────────────────────────────────────────────────────
export async function loadDashboard() {
  try {
    const t = today();
    const [mySnap, partnerSnap, coupleSnap, wm, wf] = await Promise.all([
      getDoc(rDaily(state.me, t)),
      getDoc(rDaily(state.partner, t)),
      getDoc(rCouple()),
      getLatestWeight('m'),
      getLatestWeight('f'),
    ]);

    if (mySnap.exists())      Object.assign(state.myData,      mySnap.data());
    if (partnerSnap.exists()) Object.assign(state.partnerData, partnerSnap.data());
    if (coupleSnap.exists())  state.streak = coupleSnap.data().streak ?? 0;

    if (wm) state.weightHistory.m = [...state.weightHistory.m.slice(1), wm.kg];
    if (wf) state.weightHistory.f = [...state.weightHistory.f.slice(1), wf.kg];

    state._dataLoaded = true;

    return { myData: state.myData, partnerData: state.partnerData,
             streak: state.streak, wm, wf };
  } catch (err) {
    console.warn('[dashboard]', err.message);
    return null;
  }
}

// ── Weight ────────────────────────────────────────────────────────────────────
export async function getLatestWeight(role) {
  try {
    const q    = query(rWeights(role), orderBy('createdAt', 'desc'), limit(2));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const [a, b] = snap.docs;
    const last   = a.data();
    const prev   = b?.data() ?? last;
    return { kg: last.kg, diff: +(last.kg - prev.kg).toFixed(1) };
  } catch { return null; }
}

export async function saveWeight(role, kg) {
  // Anti-cheat: max 3 kg change per day
  const q = query(rWeights(role), orderBy('createdAt','desc'), limit(1));
  const s = await getDocs(q);
  if (!s.empty && Math.abs(kg - s.docs[0].data().kg) > 3) {
    throw new Error('EXTREME_CHANGE');
  }
  await addDoc(rWeights(role), { kg, date: today(), createdAt: serverTimestamp() });
}

// ── Daily data ────────────────────────────────────────────────────────────────
export async function saveDaily(role, data) {
  await setDoc(rDaily(role, today()), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ── Workout ───────────────────────────────────────────────────────────────────
export async function saveWorkout(role, title, durationSec) {
  await addDoc(rWorkouts(role), { title, durationSec, date: today(), completedAt: serverTimestamp() });
  await saveDaily(role, { workoutDone: true, workoutDurationSec: durationSec });

  // Bump streak if both done
  const pSnap = await getDoc(rDaily(role === 'm' ? 'f' : 'm', today()));
  if (pSnap.exists() && pSnap.data().workoutDone) {
    await updateDoc(rCouple(), { streak: increment(1), lastStreakDate: today() });
  }
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export async function sendMsg(text) {
  await addDoc(rChat(), { text, sender: state.me, createdAt: serverTimestamp() });
}

// ── Habits ───────────────────────────────────────────────────────────────────
export async function saveHabit(habitId, done) {
  const habits = { ...state.myData.habits, [habitId]: done };
  state.myData.habits = habits;
  await saveDaily(state.me, { habits });
}

// ── Mood ─────────────────────────────────────────────────────────────────────
export async function saveMood(mood) {
  state.myData.mood = mood;
  await saveDaily(state.me, { mood });
}

// ── Seed ──────────────────────────────────────────────────────────────────────
export async function seedIfNeeded() {
  const s = await getDoc(rCouple());
  if (!s.exists()) {
    await setDoc(rCouple(), {
      userA: 'ilham', userB: 'navisa',
      streak: 12, lastStreakDate: today(), createdAt: serverTimestamp(),
    });
    await addDoc(rWeights('m'), { kg: 68.7, date: today(), createdAt: serverTimestamp() });
    await addDoc(rWeights('f'), { kg: 55.2, date: today(), createdAt: serverTimestamp() });
  }
}
