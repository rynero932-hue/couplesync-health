// src/firebase/config.js
// Firebase config — reads from Vite env vars, fallback to hardcoded values
// Vercel: set env vars in Project Settings → Environment Variables
// Local:  copy .env.example → .env

import { initializeApp } from 'firebase/app';
import { getAuth }       from 'firebase/auth';
import { getFirestore }  from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             || 'AIzaSyBUtoV_7JsFSqPbkfMnThv4lRFN8DdRvrY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         || 'couplesync-health.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          || 'couplesync-health',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      || 'couplesync-health.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '135310192337',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              || '1:135310192337:web:649ba80febb70c2aeb1ff0',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID      || 'G-DRB3PXM7V8',
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };
