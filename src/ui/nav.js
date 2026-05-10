// src/ui/nav.js

import { renderProgressChart } from './charts.js';
import { renderWeightChart }   from './charts.js';

export function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('on');

  if (screenId === 's-progress') setTimeout(renderProgressChart, 80);
  if (screenId === 's-weight')   setTimeout(renderWeightChart, 80);
  if (screenId === 's-water'   && window.renderGlasses)  window.renderGlasses();
  if (screenId === 's-workout' && window.renderWorkout)  window.renderWorkout();
}

// ── Nav icon SVG paths ────────────────────────────────────────────────────────
const ICONS = {
  home:     `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  progress: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  chat:     `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  profile:  `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>`,
};

function navItem(screenId, iconKey, label, activeId) {
  const active = screenId === activeId;
  const col    = active ? '#7C3AED' : '#9CA3AF';
  return `
    <div class="ni${active ? ' on' : ''}" onclick="window.go('${screenId}')" style="cursor:pointer">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="color:${col}">
        ${ICONS[iconKey]}
      </svg>
      <span style="color:${col}">${label}</span>
    </div>`;
}

function fabBtn() {
  return `
    <div class="nfab" onclick="window.go('s-workout')" style="cursor:pointer">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="5" x2="12" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="5"  y1="12" x2="19" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>`;
}

export function buildNav(activeId) {
  return [
    navItem('s-home',     'home',     'Beranda',  activeId),
    navItem('s-progress', 'progress', 'Progress', activeId),
    fabBtn(),
    navItem('s-chat',     'chat',     'Chat',     activeId),
    navItem('s-profile',  'profile',  'Akun',     activeId),
  ].join('');
}

export function injectNavs() {
  const map = {
    'bnav-home':     's-home',
    'bnav-progress': 's-progress',
    'bnav-chat':     's-chat',
    'bnav-profile':  's-profile',
  };
  for (const [id, active] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = buildNav(active);
  }
}
