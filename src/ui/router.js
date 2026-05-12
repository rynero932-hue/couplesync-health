// src/ui/router.js
import { renderProgressChart } from './charts.js';

const LAZY = {
  's-progress': () => renderProgressChart(),
  's-weight':   () => import('../screens/weight.js').then(m => m.renderWeightChart()),
  's-water':    () => import('../screens/water.js').then(m => m.renderGlasses()),
  's-workout':  () => import('../screens/workout.js').then(m => m.renderWorkoutScreen()),
  's-habits':   () => import('../screens/habits.js').then(m => m.renderHabits()),
  's-home':     () => import('../screens/home.js').then(m => m.refreshHome()),
};

export function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('on');
  if (LAZY[screenId]) setTimeout(() => LAZY[screenId](), 60);
}
