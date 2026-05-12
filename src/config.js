// ─────────────────────────────────────────────────────────────────────────────
// GANTI INFORMASI DI SINI SESUAI KEBUTUHAN
// ─────────────────────────────────────────────────────────────────────────────

export const USERS = {
  m: {
    id: 'ilham',
    name: 'Ilham',
    initial: 'I',
    email: 'ilham@couplesync.app',
    password: 'ilham123',
    gender: 'male',
    height: 175,
    weightTarget: 65,
    colorClass: 'm',
  },
  f: {
    id: 'navisa',
    name: 'Navisa',
    initial: 'N',
    email: 'navisa@couplesync.app',
    password: 'navisa123',
    gender: 'female',
    height: 160,
    weightTarget: 52,
    colorClass: 'f',
  },
};

export const COUPLE_CODE   = '281524';
export const COUPLE_ID     = 'ilham-navisa';
export const WATER_TARGET  = 8;
export const SLEEP_TARGET  = 8;
export const CALORIE_TARGET = 1800;

// Firebase config (reads .env first, falls back to hardcoded)
export const FB_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'AIzaSyBUtoV_7JsFSqPbkfMnThv4lRFN8DdRvrY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'couplesync-health.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'couplesync-health',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'couplesync-health.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '135310192337',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:135310192337:web:649ba80febb70c2aeb1ff0',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || 'G-DRB3PXM7V8',
};

export const VAPID_KEY = import.meta.env.VITE_VAPID_KEY || '';

// Workout plans
export const WORKOUTS = {
  male: {
    title: 'Upper Body Strength',
    desc: '25 menit · 150 kkal',
    badge1: 'Intermediate', badge2: 'Upper Body',
    gradient: 'linear-gradient(135deg,#4C1D95,#7C3AED)',
    accent: '#7C3AED', accentBg: '#EDE9FE',
    exercises: [
      { name: 'Push Up',        sets: 4, reps: 12, unit: 'reps'  },
      { name: 'Pull Up',        sets: 4, reps: 8,  unit: 'reps'  },
      { name: 'Dumbbell Press', sets: 4, reps: 12, unit: 'reps'  },
      { name: 'Plank',          sets: 3, reps: 45, unit: 'detik' },
    ],
  },
  female: {
    title: 'Lower Body & Core',
    desc: '20 menit · 120 kkal',
    badge1: 'Beginner', badge2: 'Lower Body',
    gradient: 'linear-gradient(135deg,#9D174D,#EC4899)',
    accent: '#EC4899', accentBg: '#FDF2F8',
    exercises: [
      { name: 'Squat',         sets: 3, reps: 15, unit: 'reps'  },
      { name: 'Glute Bridge',  sets: 3, reps: 15, unit: 'reps'  },
      { name: 'Leg Raise',     sets: 3, reps: 15, unit: 'reps'  },
      { name: 'Plank',         sets: 3, reps: 30, unit: 'detik' },
    ],
  },
};

// Habits list
export const HABITS = [
  { id: 'water',    label: 'Minum 8 gelas air',     icon: '💧' },
  { id: 'workout',  label: 'Workout hari ini',       icon: '💪' },
  { id: 'sleep',    label: 'Tidur 7-8 jam',          icon: '😴' },
  { id: 'nojunk',   label: 'Tidak junk food',        icon: '🥗' },
  { id: 'nosugar',  label: 'Tidak minuman manis',    icon: '🚫' },
  { id: 'protein',  label: 'Konsumsi protein',       icon: '🥚' },
  { id: 'steps',    label: 'Jalan 5.000 langkah',    icon: '👟' },
  { id: 'videocall',label: 'Video call bareng',      icon: '📱' },
];

// Reminder schedule
export const REMINDERS = [
  { hour: 7,  min: 0,  title: '☀️ Selamat pagi!',      body: 'Mulai hari dengan minum segelas air ya.' },
  { hour: 12, min: 0,  title: '🍗 Makan siang sehat!', body: 'Jangan skip makan, pilih yang bergizi.' },
  { hour: 17, min: 30, title: '💪 Waktunya workout!',  body: 'Jaga streak kalian bareng. Semangat!' },
  { hour: 21, min: 0,  title: '💧 Reminder minum air!',body: 'Sudah cukup minum hari ini?' },
  { hour: 22, min: 0,  title: '🌙 Waktu istirahat!',   body: 'Tidur cukup penting untuk recovery.' },
];
