// src/firebase/refs.js
// Centralised Firestore collection / doc references

import { doc, collection } from 'firebase/firestore';
import { db }              from './config.js';

const COUPLE_ID = import.meta.env.VITE_COUPLE_ID || 'ilham-navisa';

export const ref = {
  couple : ()        => doc(db, 'couples', COUPLE_ID),
  daily  : (role, d) => doc(db, 'daily', `${role}_${d}`),
  weights: (role)    => collection(db, `weights_${role}`),
  workouts: (role)   => collection(db, `workouts_${role}`),
  chat   : ()        => collection(db, 'chats', COUPLE_ID, 'messages'),
};

export const today = () => new Date().toISOString().split('T')[0];
