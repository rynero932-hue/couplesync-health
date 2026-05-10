// src/screens/login.js

import { state }            from '../state.js';
import { go }               from '../ui/nav.js';
import { showToast, fbBar } from '../ui/toast.js';

const PASSWORDS   = { m: 'ilham123', f: 'navisa123' };
const COUPLE_CODE = '281524';

// ── Lazy Firebase imports ────────────────────────────────────────────────────
async function tryFirebaseLogin(role, password) {
  const { firebaseLogin } = await import('../firebase/auth.js');
  return firebaseLogin(role, password);
}
async function tryFirebaseLogout() {
  const { firebaseLogout } = await import('../firebase/auth.js');
  return firebaseLogout();
}
async function tryStopListeners() {
  const { stopListeners } = await import('../firebase/firestore.js');
  return stopListeners();
}

// ── Public functions ─────────────────────────────────────────────────────────
export function pickUser(role) {
  state.currentUser = role;
  const fEl = document.getElementById('uc-f');
  const mEl = document.getElementById('uc-m');
  if (fEl) fEl.className = 'uc f' + (role === 'f' ? ' sel' : '');
  if (mEl) mEl.className = 'uc m' + (role === 'm' ? ' sel' : '');
  document.querySelectorAll('.lg-box').forEach((b, i) => {
    b.textContent = COUPLE_CODE[i];
    b.className   = 'lg-box ok';
  });
}

export async function doLogin() {
  const pw   = document.getElementById('lg-pw')?.value?.trim() || '';
  const role = state.currentUser;

  const fSel = document.getElementById('uc-f')?.classList.contains('sel');
  const mSel = document.getElementById('uc-m')?.classList.contains('sel');
  if (!fSel && !mSel) { showToast('Pilih dulu kamu siapa'); return; }
  if (!pw)            { showToast('Masukkan password dulu ya 😊'); return; }

  // Validate password locally first
  if (pw !== PASSWORDS[role]) {
    showToast('❌ Password salah! Coba lagi');
    return;
  }

  fbBar('Masuk ke akun…');

  // Try Firebase Auth — if user not yet created, proceed in offline mode
  try {
    await tryFirebaseLogin(role, pw);
    // onAuthStateChanged handles the rest
  } catch (err) {
    const code = err.code || '';
    if (
      code.includes('user-not-found') ||
      code.includes('invalid-credential') ||
      code.includes('invalid-login-credentials') ||
      code.includes('wrong-password') ||
      err.message?.includes('400')
    ) {
      // Firebase user not set up yet — use offline mode
      console.warn('[login] Firebase user not found, using offline mode');
      fbBar('Mode offline aktif', null);
      onLoginSuccess(role);
    } else {
      showToast('Login gagal: ' + (err.message || code));
      fbBar('Login error', false);
    }
  }
}

export function showCode() {
  document.querySelectorAll('.lg-box').forEach((b, i) => {
    b.textContent = COUPLE_CODE[i];
    b.className   = 'lg-box ok';
  });
  showToast('Kode pasangan: ' + COUPLE_CODE);
}

export async function doLogout() {
  try {
    const stop = await tryStopListeners();
    stop();
  } catch (_) {}
  try {
    const logout = await tryFirebaseLogout();
    await logout();
  } catch (_) {}
  showToast('Sampai jumpa! 💜');
  setTimeout(() => go('s-splash'), 900);
}

export function onLoginSuccess(role) {
  state.currentUser = role;
  pickUser(role);

  const h    = new Date().getHours();
  const g    = h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam';
  const name = role === 'm' ? 'Ilham' : 'Navisa';

  const greetEl = document.getElementById('hm-greet');
  const subEl   = document.getElementById('hm-sub');
  if (greetEl) greetEl.textContent = `Halo, ${name}! 👋`;
  if (subEl)   subEl.textContent   = `Semangat ${g} ini ya 💪`;

  fbBar(`Masuk sebagai ${name} ✓`, true);
  go('s-home');
}
