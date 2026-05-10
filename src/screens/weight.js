// src/screens/weight.js

import { state }             from '../state.js';
import { showToast, fbBar }  from '../ui/toast.js';
import { updateWeightChart } from '../ui/charts.js';

async function persistWeight(role, kg) {
  const { saveWeight } = await import('../firebase/firestore.js');
  return saveWeight(role, kg); // throws EXTREME_CHANGE if needed
}

export function setWeightTab(tab) {
  state.weightTab = tab;

  const meEl  = document.getElementById('wt-me');
  const diaEl = document.getElementById('wt-dia');
  if (meEl)  meEl.className  = 'wt-tab' + (tab === 'me'  ? ' on' : '');
  if (diaEl) diaEl.className = 'wt-tab' + (tab === 'dia' ? ' on' : '');

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
  const inputEl = document.getElementById('w-input');
  const v       = parseFloat(inputEl?.value || '');

  if (!v || v < 30 || v > 200) {
    showToast('Masukkan berat yang valid (30–200 kg)');
    return;
  }

  const role = state.weightTab === 'me'
    ? state.currentUser
    : (state.currentUser === 'm' ? 'f' : 'm');

  fbBar('Menyimpan berat…');
  try {
    await persistWeight(role, v);

    state.weightData[role].push(v);
    state.weightData[role].shift();
    if (inputEl) inputEl.value = '';
    setWeightTab(state.weightTab);

    const homeEl = role === 'm'
      ? document.getElementById('hm-wm')
      : document.getElementById('hm-wf');
    if (homeEl) homeEl.textContent = `${v} kg`;

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
