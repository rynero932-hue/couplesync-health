// src/state.js
// Single source of truth — mutate directly, no framework needed

export const state = {
  // Auth
  currentUser : 'm',       // 'm' | 'f'

  // Health data (local cache, synced from Firestore)
  waterCount  : 6,
  streak      : 12,
  weightData  : {
    m: [70.1, 69.8, 69.5, 69.3, 69.0, 68.9, 68.7],
    f: [56.2, 56.0, 55.8, 55.6, 55.5, 55.3, 55.2],
  },
  weightLabels: ['18/5','19/5','20/5','21/5','22/5','23/5','24/5'],

  // AI context string (built from Firestore data)
  healthCtx: '',

  // Workout
  workoutGender: 'm',
  timerSec     : 0,
  timerInterval: null,
  isPaused     : false,

  // Weight page
  weightTab: 'me',   // 'me' | 'dia'

  // Chart instances (stored so they can be destroyed before re-render)
  charts: {
    weight  : null,
    progress: null,
  },
};
