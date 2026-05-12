// src/screens/ai.js
import { state } from '../state.js';

const MODEL = 'claude-sonnet-4-20250514';

export async function sendAI() {
  const input = document.getElementById('ai-in');
  const msg   = input?.value.trim() ?? '';
  if (!msg) return;
  if (input) input.value = '';

  const msgs = document.getElementById('ai-msgs');
  if (!msgs) return;

  // User bubble
  appendMsg(msgs, msg, 'user');

  // Bot typing bubble
  const botDiv = appendMsg(msgs, '', 'bot', true);
  msgs.scrollTop = msgs.scrollHeight;

  const system = buildSystem();
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL, max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: msg }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = data.content?.[0]?.text ?? 'Maaf, tidak bisa menjawab sekarang.';
    const bub  = botDiv.querySelector('.ai-bub');
    if (bub) bub.innerHTML = text.replace(/\n/g, '<br>');
  } catch (err) {
    const bub = botDiv.querySelector('.ai-bub');
    if (bub) bub.textContent = 'Koneksi error. Coba lagi ya!';
  }
  msgs.scrollTop = msgs.scrollHeight;
}

export function aiAsk(q) {
  const input = document.getElementById('ai-in');
  if (input) input.value = q;
  sendAI();
}

function buildSystem() {
  const myName = state.myUser?.name ?? 'User';
  const ctx    = state.healthCtx || `${myName} sedang menggunakan Better Together.`;
  return `Kamu adalah AI Health Coach untuk "Better Together" — aplikasi kesehatan untuk pasangan LDR.

${ctx}

Panduan:
- Sapa dengan nama yang relevan
- Hangat, supportif, tidak menghakimi
- Maks 3 paragraf singkat dan praktis
- Bahasa Indonesia yang natural`;
}

function appendMsg(container, text, role, typing = false) {
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  if (role === 'bot') {
    div.innerHTML = `
      <div class="ai-bot-hdr">
        <div class="ai-av-sm">🤖</div>
        <span class="ai-bot-name">Coach AI</span>
      </div>
      <div class="ai-bub">${typing
        ? '<div class="dot-typing"><span></span><span></span><span></span></div>'
        : text}</div>`;
  } else {
    div.innerHTML = `<div class="ai-bub user-bub">${text}</div>`;
  }
  container.appendChild(div);
  return div;
}
