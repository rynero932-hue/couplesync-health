// src/screens/login.js

import { state }             from '../state.js';
import { go }                from '../ui/nav.js';
import { showToast, fbBar }  from '../ui/toast.js';

const PASSWORDS   = { m: 'ilham123', f: 'navisa123' };
const COUPLE_CODE = '281524';

// Lazy-import Firebase to avoid blocking initial render
async function getFirebaseAuth() {
  const { firebaseLogin } = await import('../firebase/auth.js');
  return { firebaseLogin };
}
async function getFirebaseLogout() {
  const { firebaseLogout } = await import('../firebase/auth.js');
  return firebaseLogout;
}
async function getListeners() {
  const { stopListeners } = await import('../firebase/firestore.js');
  return stopListeners;
}

export function pickUser(role) {
  state.currentUser = role;
  const fEl = document.getElementById('uc-f');
  const mEl = document.getElementById('uc-m');
  if (fEl) fEl.className = 'uc f' + (role === 'f' ? ' sel' : '');
  if (mEl) mEl.className = 'uc m' + (role === 'm' ? ' sel' : '');
  // Fill couple code boxes
  document.querySelectorAll('.lg-box').forEach((b, i) => {
    b.textContent = COUPLE_CODE[i];
    b.className   = 'lg-box ok';
  });
}

export async function doLogin() {
  const pw   = document.getElementById('lg-pw')?.value || '';
  const role = state.currentUser;

  const fSel = document.getElementById('uc-f')?.classList.contains('sel');
  const mSel = document.getElementById('uc-m')?.classList.contains('sel');
  if (!fSel && !mSel) { showToast('Pilih dulu kamu siapa'); return; }
  if (!pw)            { showToast('Masukkan password dulu ya 😊'); return; }

  fbBar('Masuk ke akun…');
  try {
    const { firebaseLogin } = await getFirebaseAuth();
    await firebaseLogin(role, pw);
    // onAuthStateChanged in auth.js handles navigation + data load
  } catch (err) {
    const isWrongPw = err.code?.includes('wrong-password') ||
                      err.code?.includes('invalid-credential') ||
                      err.code?.includes('invalid-login-credentials');
    const msg = isWrongPw ? 'Password salah! Coba lagi' : 'Login gagal: ' + err.message;
    showToast('❌ ' + msg);
    fbBar(msg, false);
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
  const stopListeners = await getListeners();
  stopListeners();
  const firebaseLogout = await getFirebaseLogout();
  await firebaseLogout();
  showToast('Sampai jumpa! 💜');
  setTimeout(() => go('s-splash'), 900);
}

/** Called by auth.js onAuthStateChanged after successful login */
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

  fbBar(`Sesi aktif: ${name}`, true);
  go('s-home');
}
