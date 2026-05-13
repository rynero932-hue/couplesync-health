// src/screens/ai.js
// Uses /api/chat (Vercel serverless) — API key is server-side only

import { state } from '../state.js';

// In dev: calls Vercel function directly (needs `vercel dev` or deployed)
// In prod: /api/chat is on same domain, no CORS issues
const API_ENDPOINT = '/api/chat';

export async function sendAI() {
  const input = document.getElementById('ai-in');
  const msg   = input?.value.trim() ?? '';
  if (!msg) return;
  if (input) input.value = '';

  const msgs = document.getElementById('ai-msgs');
  if (!msgs) return;

  appendMsg(msgs, msg, 'user');
  const botDiv = appendMsg(msgs, '', 'bot', true);
  msgs.scrollTop = msgs.scrollHeight;

  const system = buildSystem();

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system,
        max_tokens: 1000,
        messages: [{ role: 'user', content: msg }],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      // Give a helpful error message based on status
      if (res.status === 500 && errData.error?.includes('ANTHROPIC_API_KEY')) {
        throw new Error('API key belum dikonfigurasi di Vercel. Lihat README.');
      }
      throw new Error(`Server error ${res.status}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? 'Maaf, tidak ada respons.';
    const bub  = botDiv.querySelector('.ai-bub');
    if (bub) bub.innerHTML = text.replace(/\n/g, '<br>');

  } catch (err) {
    console.error('[AI]', err);
    const bub = botDiv.querySelector('.ai-bub');
    if (bub) {
      bub.innerHTML = err.message.includes('API key')
        ? '⚠️ AI Coach belum diaktifkan.<br><small>Tambahkan <b>ANTHROPIC_API_KEY</b> di Vercel → Settings → Environment Variables, lalu redeploy.</small>'
        : 'Koneksi error. Coba lagi ya! 🙏';
    }
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

Panduan menjawab:
- Sapa dengan nama yang relevan (${myName} atau pasangannya)
- Hangat, supportif, tidak menghakimi
- Maksimal 3 paragraf singkat dan praktis
- Bahasa Indonesia yang natural dan friendly
- Berikan saran yang realistis dan bisa langsung dilakukan`;
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
