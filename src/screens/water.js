// src/screens/water.js
import { state }     from '../state.js';
import { saveDaily } from '../firebase/db.js';
import { toast }     from '../ui/toast.js';

export function renderGlasses() {
  const grid = document.getElementById('glasses-g');
  if (!grid) return;
  const count = state.myData.water ?? 0;
  grid.innerHTML = Array.from({ length: 8 }, (_, i) => `
    <div class="glass ${i < count ? 'filled' : ''}" onclick="window.toggleGlass(${i})">
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
        <path d="M6 4 L4 36 Q4 38 6 38 L26 38 Q28 38 28 36 L26 4 Z"
              fill="${i < count ? '#BAE6FD' : '#F3F4F6'}"
              stroke="${i < count ? '#0891B2' : '#D1D5DB'}" stroke-width="1.5"/>
        ${i < count ? '<path d="M4 24 Q4 38 6 38 L26 38 Q28 38 28 36 L28 24 Z" fill="#7DD3FC" opacity="0.6"/>' : ''}
      </svg>
    </div>`).join('');

  const disp = document.getElementById('water-disp');
  if (disp) disp.textContent = count;
  const pct = document.getElementById('water-pct');
  if (pct) pct.textContent = `${count}/8 gelas`;
}

export function toggleGlass(i) {
  const count = state.myData.water ?? 0;
  state.myData.water = i < count ? i : i + 1;
  renderGlasses();
  persistWater();
}

export function addGlass() {
  const count = state.myData.water ?? 0;
  if (count >= 8) { toast('Target air minum tercapai! 🎉'); return; }
  state.myData.water = count + 1;
  renderGlasses();
  toast('+1 gelas! Tetap terhidrasi 💧');
  persistWater();
}

async function persistWater() {
  try { await saveDaily(state.me, { water: state.myData.water }); }
  catch (e) { console.warn('[water]', e.message); }
}
