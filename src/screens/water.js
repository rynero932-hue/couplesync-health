// src/screens/water.js

import { state }      from '../state.js';
import { showToast }  from '../ui/toast.js';
import { saveWater }  from '../firebase/firestore.js';

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
  saveWater(state.waterCount).catch(console.error);
}

export function addGlass() {
  if (state.waterCount < 8) {
    state.waterCount++;
    renderGlasses();
    showToast('+1 gelas! Tetap terhidrasi 💧');
    saveWater(state.waterCount).catch(console.error);
  } else {
    showToast('Target air minum tercapai! 🎉');
  }
}
