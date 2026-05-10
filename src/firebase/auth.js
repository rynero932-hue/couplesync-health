// src/firebase/auth.js

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth }  from './config.js';
import { loadDashboard, startChatListener, startPartnerListener } from './firestore.js';

const EMAILS = {
  m: import.meta.env.VITE_USER_EMAIL_MALE   || 'ilham@couplesync.app',
  f: import.meta.env.VITE_USER_EMAIL_FEMALE || 'navisa@couplesync.app',
};

/** Login with Firebase Auth */
export async function firebaseLogin(role, password) {
  return signInWithEmailAndPassword(auth, EMAILS[role], password);
}

/** Sign out */
export async function firebaseLogout() {
  return signOut(auth);
}

/** Listen to auth state — call once on app start */
export function initAuthListener(onLogin) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const role = user.email.startsWith('ilham') ? 'm' : 'f';
    onLogin(role);
    await loadDashboard();
    startChatListener();
    startPartnerListener();
  });
}
