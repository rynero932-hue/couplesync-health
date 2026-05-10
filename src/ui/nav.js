// src/ui/nav.js

import { renderProgressChart } from './charts.js';
import { renderWeightChart }   from './charts.js';
import { renderGlasses }       from '../screens/water.js';
import { renderWorkout }       from '../screens/workout.js';

export function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('on');

  // Lazy init
  if (screenId === 's-progress') setTimeout(renderProgressChart, 80);
  if (screenId === 's-weight')   setTimeout(renderWeightChart, 80);
  if (screenId === 's-water')    renderGlasses();
  if (screenId === 's-workout')  renderWorkout();
}

// Bottom nav HTML builder
const NAV_ICONS = {
  's-home'    : `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  's-progress': `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  's-chat'    : `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  's-profile' : `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>`,
};
const NAV_LABELS = { 's-home': 'Beranda', 's-progress': 'Progress', 's-chat': 'Chat', 's-profile': 'Akun' };

export function buildNav(activeId) {
  const items = Object.keys(NAV_ICONS);
  return items.flatMap((id, i) => {
    const parts = [];
    if (i === 2) {
      // FAB in the middle
      parts.push(`<div class="nfab" onclick="window.go('s-workout')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>`);
    }
    const col = id === activeId ? '#7C3AED' : '#9CA3AF';
    parts.push(`
      <div class="ni${id === activeId ? ' on' : ''}" onclick="window.go('${id}')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="color:${col}">${NAV_ICONS[id]}</svg>
        <span>${NAV_LABELS[id]}</span>
      </div>`);
    return parts;
  }).join('');
}

export function injectNavs() {
  const mapping = {
    'bnav-home':     's-home',
    'bnav-progress': 's-progress',
    'bnav-chat':     's-chat',
    'bnav-profile':  's-profile',
  };
  for (const [elId, activeId] of Object.entries(mapping)) {
    const el = document.getElementById(elId);
    if (el) el.innerHTML = buildNav(activeId);
  }
}
