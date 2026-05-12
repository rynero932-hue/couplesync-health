// src/ui/charts.js
import Chart from 'chart.js/auto';
import { state } from '../state.js';

const OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#F3F4F6' }, ticks: { color: '#9CA3AF', font: { size: 10, family: 'Inter' } } },
    y: { grid: { color: '#F3F4F6' }, ticks: { color: '#9CA3AF', font: { size: 10, family: 'Inter' } } },
  },
};

function mkDataset(data, color) {
  return { data, borderColor: color, backgroundColor: color + '18',
           borderWidth: 2.5, tension: .4, fill: true,
           pointRadius: 4, pointBackgroundColor: color,
           pointBorderColor: '#fff', pointBorderWidth: 2 };
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
        { ...mkDataset(state.weightHistory.m, '#7C3AED'), label: 'Ilham', fill: false },
        { ...mkDataset(state.weightHistory.f, '#EC4899'), label: 'Navisa', fill: false },
      ],
    },
    options: { ...OPTS },
  });
}

export function renderWeightChartFn(role) {
  const ctx = document.getElementById('wt-chart');
  if (!ctx) return;
  if (state.charts.weight) { state.charts.weight.destroy(); state.charts.weight = null; }
  const col = role === 'm' ? '#7C3AED' : '#EC4899';
  state.charts.weight = new Chart(ctx, {
    type: 'line',
    data: { labels: state.weightLabels, datasets: [mkDataset(state.weightHistory[role], col)] },
    options: { ...OPTS },
  });
}

export function updateWeightChart(role) {
  if (!state.charts.weight) return renderWeightChartFn(role);
  const col = role === 'm' ? '#7C3AED' : '#EC4899';
  const ds  = state.charts.weight.data.datasets[0];
  ds.data             = state.weightHistory[role];
  ds.borderColor      = col;
  ds.backgroundColor  = col + '18';
  ds.pointBackgroundColor = col;
  state.charts.weight.update();
}
