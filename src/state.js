// src/state.js — single source of truth
import { USERS } from './config.js';

export const state = {
  // Auth
  me: null,
  partner: null,
  currentPick: null,

  // Today's data (loaded from Firestore, default = empty)
  myData: {
    water: 0,
    habits: {},
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

  // Weight history — shown as dashes until Firestore loads
  weightHistory: {
    m: [null, null, null, null, null, null, null],
    f: [null, null, null, null, null, null, null],
  },
  weightLabels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],

  // Streak — 0 until loaded from Firestore
  streak: 0,

  // Workout tracking
  workoutGender: 'male',
  timerSec: 0,
  timerIv: null,
  isPaused: false,

  // Weight page tab
  weightTab: 'me',

  // Charts
  charts: { weight: null, progress: null },

  // AI context string
  healthCtx: '',

  // Internal flags
  _partnerWkNotified: false,
  _dataLoaded: false,

  // Helpers
  get myUser()      { return this.me      ? USERS[this.me]      : null; },
  get partnerUser() { return this.partner ? USERS[this.partner] : null; },
};

export function setUser(role) {
  state.me      = role;
  state.partner = role === 'm' ? 'f' : 'm';
  state.workoutGender = USERS[role].gender;
  state._partnerWkNotified = false;
  // Reset today data when switching users
  state.myData      = { water:0, habits:{}, workoutDone:false, workoutDurationSec:0, mood:null, weight:null };
  state.partnerData = { water:0, habits:{}, workoutDone:false, workoutDurationSec:0, mood:null, weight:null };
  state._dataLoaded = false;
}
