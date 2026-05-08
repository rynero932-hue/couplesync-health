// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUtoV_7JsFSqPbkfMnThv4lRFN8DdRvrY",
  authDomain: "couplesync-health.firebaseapp.com",
  projectId: "couplesync-health",
  storageBucket: "couplesync-health.firebasestorage.app",
  messagingSenderId: "135310192337",
  appId: "1:135310192337:web:649ba80febb70c2aeb1ff0",
  measurementId: "G-DRB3PXM7V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
