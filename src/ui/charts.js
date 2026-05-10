// src/ui/charts.js
import Chart from 'chart.js/auto';
import { state } from '../state.js';

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#F3F4F6' }, ticks: { color: '#9CA3AF', font: { size: 10, family: 'Inter', weight: '500' } } },
    y: { grid: { color: '#F3F4F6' }, ticks: { color: '#9CA3AF', font: { size: 10, family: 'Inter', weight: '500' } } },
  },
};

export function renderWeightChart() {
  const ctx = document.getElementById('wt-chart');
  if (!ctx) return;
  if (state.charts.weight) { state.charts.weight.destroy(); state.charts.weight = null; }

  const role = state.weightTab === 'me' ? state.currentUser : (state.currentUser === 'm' ? 'f' : 'm');
  const col  = role === 'm' ? '#7C3AED' : '#EC4899';

  state.charts.weight = new Chart(ctx, {
    type: 'line',
    data: {
      labels: state.weightLabels,
      datasets: [{
        data: state.weightData[role],
        borderColor: col, backgroundColor: col + '18',
        borderWidth: 2.5, tension: .45, fill: true,
        pointRadius: 4, pointBackgroundColor: col,
        pointBorderColor: 'white', pointBorderWidth: 2,
      }],
    },
    options: { ...CHART_DEFAULTS },
  });
}

export function renderProgressChart() {
  const ctx = document.getElementById('prg-chart');
  if (!ctx) return;
  if (state.charts.progress) { state.charts.progress.destroy(); state.charts.progress = null; }

  state.charts.progress = new Chart(ctx, {
    type: 'line',
    data: {
      labels: state.weightLabels,
      datasets: [
        {
          label: 'Ilham', data: state.weightData.m,
          borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,.08)',
          borderWidth: 2.5, tension: .45, fill: false,
          pointRadius: 4, pointBackgroundColor: '#7C3AED',
          pointBorderColor: 'white', pointBorderWidth: 2,
        },
        {
          label: 'Navisa', data: state.weightData.f,
          borderColor: '#EC4899', backgroundColor: 'rgba(236,72,153,.08)',
          borderWidth: 2.5, tension: .45, fill: false,
          pointRadius: 4, pointBackgroundColor: '#EC4899',
          pointBorderColor: 'white', pointBorderWidth: 2,
        },
      ],
    },
    options: { ...CHART_DEFAULTS },
  });
}

export function updateWeightChart() {
  if (!state.charts.weight) return;
  const role = state.weightTab === 'me' ? state.currentUser : (state.currentUser === 'm' ? 'f' : 'm');
  const col  = role === 'm' ? '#7C3AED' : '#EC4899';
  state.charts.weight.data.datasets[0].data            = state.weightData[role];
  state.charts.weight.data.datasets[0].borderColor     = col;
  state.charts.weight.data.datasets[0].backgroundColor = col + '18';
  state.charts.weight.update();
}
