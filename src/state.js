// src/state.js — single source of truth
import { USERS, WATER_TARGET } from './config.js';

export const state = {
  // Auth
  me: null,           // 'm' | 'f' — current logged-in user
  partner: null,      // 'm' | 'f' — the other user

  // Today's data (synced from Firestore)
  myData: {
    water: 0,
    habits: {},       // { habitId: true/false }
    workoutDone: false,
    workoutDurationSec: 0,
    mood: null,
    weight: null,
  },
  partnerData: {
    water: 0,
    habits: {},
    workoutDone: false,
    workoutDurationSec: 0,
    mood: null,
    weight: null,
  },

  // Weight history (7 days, loaded from Firestore)
  weightHistory: {
    m: [70.1, 69.8, 69.5, 69.3, 69.0, 68.9, 68.7],
    f: [56.2, 56.0, 55.8, 55.6, 55.5, 55.3, 55.2],
  },
  weightLabels: ['18/5','19/5','20/5','21/5','22/5','23/5','24/5'],

  // Streak
  streak: 12,

  // Workout tracking
  workoutGender: 'male',
  timerSec: 0,
  timerIv: null,
  isPaused: false,

  // Weight page tab
  weightTab: 'me',

  // Charts
  charts: { weight: null, progress: null },

  // AI context
  healthCtx: '',

  // Helpers
  get myUser()      { return USERS[this.me]; },
  get partnerUser() { return USERS[this.partner]; },
};

export function setUser(role) {
  state.me      = role;
  state.partner = role === 'm' ? 'f' : 'm';
  state.workoutGender = USERS[role].gender;
}
