// src/screens/weight.js
import { state }              from '../state.js';
import { saveWeight }         from '../firebase/db.js';
import { toast, statusBar }   from '../ui/toast.js';
import { renderWeightChartFn, updateWeightChart } from '../ui/charts.js';

export function renderWeightChart() {
  const role = state.weightTab === 'me' ? state.me : state.partner;
  renderWeightChartFn(role);
  updateWeightStats(role);
}

export function setWeightTab(tab) {
  state.weightTab = tab;
  const meEl  = document.getElementById('wt-me');
  const diaEl = document.getElementById('wt-dia');
  if (meEl)  meEl.className  = 'wt-tab' + (tab === 'me'  ? ' on' : '');
  if (diaEl) diaEl.className = 'wt-tab' + (tab === 'dia' ? ' on' : '');
  const role = tab === 'me' ? state.me : state.partner;
  updateWeightChart(role);
  updateWeightStats(role);
}

function updateWeightStats(role) {
  const hist = state.weightHistory[role];
  const last = hist[hist.length - 1];
  const prev = hist[hist.length - 2];
  const diff = +(last - prev).toFixed(1);

  const kgEl   = document.getElementById('wt-kg');
  const diffEl = document.getElementById('wt-diff');
  if (kgEl)   kgEl.textContent   = `${last} kg`;
  if (diffEl) {
    diffEl.textContent = `${diff > 0 ? '+' : ''}${diff} kg dari kemarin`;
    diffEl.className   = 'wt-diff ' + (diff <= 0 ? 'neg' : 'pos');
  }
}

export async function recordWeight() {
  const inputEl = document.getElementById('w-input');
  const v       = parseFloat(inputEl?.value ?? '');
  if (!v || v < 30 || v > 200) { toast('Masukkan berat yang valid (30–200 kg)'); return; }

  const role = state.weightTab === 'me' ? state.me : state.partner;
  statusBar('Menyimpan berat…');
  try {
    await saveWeight(role, v);
    state.weightHistory[role] = [...state.weightHistory[role].slice(1), v];
    if (inputEl) inputEl.value = '';
    setWeightTab(state.weightTab);
    // Update home card
    const homeEl = document.getElementById(role === 'm' ? 'hm-wt-m' : 'hm-wt-f');
    if (homeEl) homeEl.textContent = `${v} kg`;
    toast('✓ Berat berhasil dicatat! 👍');
    statusBar('Berat tersimpan ✓', true);
  } catch (err) {
    if (err.message === 'EXTREME_CHANGE') toast('Perubahan terlalu ekstrem (max 3 kg/hari) ⚠️');
    else toast('Gagal simpan. Coba lagi.');
    statusBar('Gagal simpan berat', false);
  }
}
