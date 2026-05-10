// src/screens/ai.js

import { state } from '../state.js';

const AI_MODEL = 'claude-sonnet-4-20250514';

export async function sendAI() {
  const input = document.getElementById('ai-in');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';

  const msgs = document.getElementById('ai-msgs');

  // User bubble
  const ud = document.createElement('div');
  ud.className = 'ai-msg user';
  ud.innerHTML = `<div class="ai-bub">${escHtml(msg)}</div>`;
  msgs.appendChild(ud);

  // Bot typing bubble
  const ld = document.createElement('div');
  ld.className = 'ai-msg bot';
  ld.innerHTML = `
    <div class="ai-bot-hdr">
      <div class="ai-bot-av">${botIconSvg()}</div>
      <span class="ai-bot-name">Coach AI</span>
    </div>
    <div class="ai-bub">
      <div class="dot-typing"><span></span><span></span><span></span></div>
    </div>`;
  msgs.appendChild(ld);
  msgs.scrollTop = msgs.scrollHeight;

  const system = buildSystem();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      AI_MODEL,
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: msg }],
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const text = data.content?.[0]?.text || 'Maaf, tidak bisa menjawab sekarang.';
    ld.querySelector('.ai-bub').innerHTML = text.replace(/\n/g, '<br>');
  } catch (err) {
    console.error('[sendAI]', err);
    ld.querySelector('.ai-bub').textContent = 'Koneksi error. Coba lagi ya!';
  }

  msgs.scrollTop = msgs.scrollHeight;
}

export function aiAsk(question) {
  document.getElementById('ai-in').value = question;
  sendAI();
}

function buildSystem() {
  const ctx = state.healthCtx || fallbackCtx();
  return `Kamu adalah AI Health Coach untuk aplikasi "Better Together" — aplikasi kesehatan khusus pasangan LDR bernama Ilham dan Navisa.

${ctx}

Panduan menjawab:
- Sapa dengan nama yang relevan
- Hangat, supportif, dan tidak menghakimi
- Maksimal 3 paragraf singkat
- Bahasa Indonesia yang natural dan casual
- Berikan saran yang praktis dan realistis`;
}

function fallbackCtx() {
  return `Data (offline):
- Ilham  : 68.7 kg, target 65 kg
- Navisa : 55.2 kg, target 52 kg
- Streak : ${state.streak} hari
- Air    : ${state.waterCount}/8 gelas`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function botIconSvg() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="10" rx="2" stroke="white" stroke-width="2"/>
    <path d="M9 11V7a3 3 0 0 1 6 0v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <circle cx="9" cy="16" r="1" fill="white"/>
    <circle cx="15" cy="16" r="1" fill="white"/>
  </svg>`;
}
