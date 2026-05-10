// src/screens/weight.js

import { state }                   from '../state.js';
import { showToast, fbBar }        from '../ui/toast.js';
import { updateWeightChart }       from '../ui/charts.js';
import { saveWeight, getLatestWeight } from '../firebase/firestore.js';

export function setWeightTab(tab) {
  state.weightTab = tab;

  document.getElementById('wt-me').className  = 'wt-tab' + (tab === 'me'  ? ' on' : '');
  document.getElementById('wt-dia').className = 'wt-tab' + (tab === 'dia' ? ' on' : '');

  const role = tab === 'me'
    ? state.currentUser
    : (state.currentUser === 'm' ? 'f' : 'm');

  const data = state.weightData[role];
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const diff = parseFloat((last - prev).toFixed(1));

  const kgEl   = document.getElementById('wt-kg');
  const diffEl = document.getElementById('wt-diff');
  if (kgEl)   kgEl.textContent   = `${last} kg`;
  if (diffEl) {
    diffEl.textContent = `${diff <= 0 ? '' : '+'}${diff} kg dari kemarin`;
    diffEl.className   = 'wt-diff ' + (diff <= 0 ? 'neg' : 'pos');
  }

  updateWeightChart();
}

export async function recordWeight() {
  const v = parseFloat(document.getElementById('w-input').value);

  if (!v || v < 30 || v > 200) {
    showToast('Masukkan berat yang valid (30–200 kg)');
    return;
  }

  const role = state.weightTab === 'me'
    ? state.currentUser
    : (state.currentUser === 'm' ? 'f' : 'm');

  fbBar('Menyimpan berat…');
  try {
    await saveWeight(role, v);

    // Update local cache
    state.weightData[role].push(v);
    state.weightData[role].shift();
    document.getElementById('w-input').value = '';

    // Refresh weight tab display
    setWeightTab(state.weightTab);

    // Update home cards
    if (role === 'm') {
      const el = document.getElementById('hm-wm');
      if (el) el.textContent = `${v} kg`;
    } else {
      const el = document.getElementById('hm-wf');
      if (el) el.textContent = `${v} kg`;
    }

    showToast('✓ Berat berhasil dicatat! 👍');
    fbBar('Berat tersimpan ✓', true);
  } catch (err) {
    if (err.message === 'EXTREME_CHANGE') {
      showToast('Perubahan terlalu ekstrem, cek lagi ya ⚠️');
    } else {
      console.error('[recordWeight]', err);
      showToast('Gagal simpan. Coba lagi.');
    }
    fbBar('Gagal simpan berat', false);
  }
}
