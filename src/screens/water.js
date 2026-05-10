// src/screens/water.js

import { state }     from '../state.js';
import { showToast } from '../ui/toast.js';

async function persistWater(count) {
  try {
    const { saveWater } = await import('../firebase/firestore.js');
    await saveWater(count);
  } catch (e) { console.warn('[water] offline:', e.message); }
}

export function renderGlasses() {
  const grid = document.getElementById('glasses-g');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 8 }, (_, i) => `
    <div class="glass-item${i < state.waterCount ? ' filled' : ''}"
         onclick="window.toggleGlass(${i})">
      ${i < state.waterCount ? '🥤' : '🫗'}
    </div>`).join('');
  const disp = document.getElementById('water-disp');
  if (disp) disp.textContent = state.waterCount;
}

export function toggleGlass(i) {
  state.waterCount = i < state.waterCount ? i : i + 1;
  renderGlasses();
  persistWater(state.waterCount);
}

export function addGlass() {
  if (state.waterCount < 8) {
    state.waterCount++;
    renderGlasses();
    showToast('+1 gelas! Tetap terhidrasi 💧');
    persistWater(state.waterCount);
  } else {
    showToast('Target air minum tercapai! 🎉');
  }
}
