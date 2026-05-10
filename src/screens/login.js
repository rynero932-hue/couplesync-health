// src/screens/login.js

import { state }         from '../state.js';
import { go }            from '../ui/nav.js';
import { showToast, fbBar } from '../ui/toast.js';
import { firebaseLogin, firebaseLogout } from '../firebase/auth.js';
import { stopListeners } from '../firebase/firestore.js';

const PASSWORDS   = { m: 'ilham123', f: 'navisa123' };
const COUPLE_CODE = '281524';

export function pickUser(role) {
  state.currentUser = role;
  document.getElementById('uc-f').className = 'uc f' + (role === 'f' ? ' sel' : '');
  document.getElementById('uc-m').className = 'uc m' + (role === 'm' ? ' sel' : '');
  // Fill code boxes
  document.querySelectorAll('.lg-box').forEach((b, i) => {
    b.textContent = COUPLE_CODE[i];
    b.className   = 'lg-box ok';
  });
}

export async function doLogin() {
  const pw   = document.getElementById('lg-pw').value;
  const role = state.currentUser;

  const fSel = document.getElementById('uc-f').classList.contains('sel');
  const mSel = document.getElementById('uc-m').classList.contains('sel');
  if (!fSel && !mSel) { showToast('Pilih dulu kamu siapa'); return; }
  if (!pw)            { showToast('Masukkan password dulu ya 😊'); return; }

  fbBar('Masuk ke akun…');
  try {
    await firebaseLogin(role, pw);
    // onAuthStateChanged in auth.js handles navigation + data load
  } catch (err) {
    const msg = (err.code?.includes('password') || err.code?.includes('credential'))
      ? 'Password salah! Coba lagi'
      : 'Login gagal: ' + err.message;
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
  stopListeners();
  await firebaseLogout();
  showToast('Sampai jumpa! 💜');
  setTimeout(() => go('s-splash'), 900);
}

/** Called by auth.js after Firebase confirms login */
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
