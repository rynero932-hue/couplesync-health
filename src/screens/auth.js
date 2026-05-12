// src/screens/auth.js
import { state, setUser }              from '../state.js';
import { USERS, COUPLE_CODE }          from '../config.js';
import { fbLogin, fbLogout, listenAuth,
         seedIfNeeded, stopListeners } from '../firebase/db.js';
import { toast, statusBar }            from '../ui/toast.js';
import { go }                          from '../ui/router.js';
import { initHome }                    from './home.js';
import { initChat }                    from './chat.js';

// ── User picker ───────────────────────────────────────────────────────────────
export function pickUser(role) {
  state.currentPick = role;
  document.getElementById('uc-f').className = 'uc f' + (role === 'f' ? ' sel' : '');
  document.getElementById('uc-m').className = 'uc m' + (role === 'm' ? ' sel' : '');
  document.querySelectorAll('.lg-box').forEach((b, i) => {
    b.textContent = COUPLE_CODE[i];
    b.className   = 'lg-box ok';
  });
}

export function showCode() {
  document.querySelectorAll('.lg-box').forEach((b, i) => {
    b.textContent = COUPLE_CODE[i];
    b.className   = 'lg-box ok';
  });
  toast('Kode pasangan: ' + COUPLE_CODE);
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function doLogin() {
  const role = state.currentPick;
  if (!role) { toast('Pilih dulu kamu siapa'); return; }

  const pw = document.getElementById('lg-pw')?.value?.trim() ?? '';
  if (!pw)  { toast('Masukkan password dulu ya 😊'); return; }

  // Validate password locally first
  if (pw !== USERS[role].password) {
    toast('❌ Password salah! Coba lagi');
    document.getElementById('lg-pw').value = '';
    document.getElementById('lg-pw').classList.add('shake');
    setTimeout(() => document.getElementById('lg-pw').classList.remove('shake'), 500);
    return;
  }

  statusBar('Masuk ke akun…');
  try {
    await fbLogin(role, pw);
    // onAuthStateChanged handles the rest
  } catch (err) {
    // Firebase user not created yet OR network error → offline mode
    const isSetupError = err.code?.includes('not-found') ||
                         err.code?.includes('credential') ||
                         err.code?.includes('invalid') ||
                         err.message?.includes('400');
    if (isSetupError) {
      console.warn('[login] Firebase Auth not set up, using offline mode');
      statusBar('Mode offline aktif', null);
      await onLoginSuccess(role);
    } else {
      toast('Login gagal: ' + (err.message ?? err.code));
      statusBar('Login error', false);
    }
  }
}

// ── Called after successful auth (Firebase or offline) ────────────────────────
export async function onLoginSuccess(role) {
  setUser(role);

  const h    = new Date().getHours();
  const g    = h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam';
  const name = USERS[role].name;

  // Greeting
  const greetEl = document.getElementById('hm-greet');
  const subEl   = document.getElementById('hm-sub');
  if (greetEl) greetEl.textContent = `Halo, ${name}! 👋`;
  if (subEl)   subEl.textContent   = `Semangat ${g} ini ya 💪`;

  // Switch-user card: show partner
  const partnerRole = role === 'm' ? 'f' : 'm';
  const partner     = USERS[partnerRole];
  const switchAv   = document.getElementById('switch-av');
  const switchName = document.getElementById('switch-name');
  if (switchAv)  { switchAv.textContent = partner.initial; switchAv.className = `switch-av ${partnerRole}`; }
  if (switchName) switchName.textContent = `Ganti ke akun ${partner.name}`;

  // Weight card labels
  const myWtEl = document.getElementById('hm-wt-me');
  const prWtEl = document.getElementById('hm-wt-partner');
  const wh = state.weightHistory;
  if (myWtEl) myWtEl.textContent = `${wh[role][wh[role].length-1]} kg`;
  if (prWtEl) prWtEl.textContent = `${wh[partnerRole][wh[partnerRole].length-1]} kg`;

  statusBar(`Masuk sebagai ${name} ✓`, true);

  // Seed & load
  seedIfNeeded().catch(console.warn);
  await initHome();
  initChat();

  go('s-home');
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function doLogout() {
  stopListeners();
  try { await fbLogout(); } catch (_) {}
  state.me      = null;
  state.partner = null;
  state.currentPick = null;
  document.getElementById('lg-pw').value = '';
  toast('Sampai jumpa! 💜');
  setTimeout(() => go('s-splash'), 800);
}

// ── Switch user (logout + go to login) ───────────────────────────────────────
export function switchUser() {
  stopListeners();
  try { fbLogout(); } catch (_) {}
  state.me = state.partner = state.currentPick = null;
  document.getElementById('lg-pw').value = '';
  go('s-login');
}

// ── Session restore ───────────────────────────────────────────────────────────
export function initAuthListener() {
  listenAuth(async role => {
    if (!state.me) await onLoginSuccess(role);
  });
}
