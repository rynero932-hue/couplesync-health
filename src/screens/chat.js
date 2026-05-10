// src/screens/chat.js

import { state }         from '../state.js';
import { AUTO_REPLIES }  from '../data/workouts.js';

async function persistMessage(text) {
  const { sendChatMessage } = await import('../firebase/firestore.js');
  return sendChatMessage(text);
}

export async function sendChat() {
  const inputEl = document.getElementById('chat-in');
  const text    = inputEl?.value.trim() || '';
  if (!text) return;
  inputEl.value = '';

  try {
    await persistMessage(text);
    // Firestore realtime listener re-renders messages automatically
  } catch (err) {
    console.error('[sendChat]', err);
    // Offline fallback
    appendLocal(text, true);
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      appendLocal(reply, false);
    }, 1100);
  }
}

export function sendCheer(msg) {
  const inputEl = document.getElementById('chat-in');
  if (inputEl) inputEl.value = msg;
  sendChat();
}

function appendLocal(text, isMe) {
  const msgs = document.getElementById('chat-msgs');
  if (!msgs) return;
  const time  = new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' });
  const div   = document.createElement('div');
  div.className = 'msg ' + (isMe ? 'me' : 'them');

  const safeText = String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (isMe) {
    div.innerHTML = `<div class="msg-bub">${safeText}</div><span class="msg-time">${time}</span>`;
  } else {
    const pRole = state.currentUser === 'm' ? 'f' : 'm';
    const init  = pRole === 'f' ? 'N' : 'I';
    div.innerHTML = `
      <div class="chat-av-row">
        <div class="chat-smav ${pRole}">${init}</div>
        <div><div class="msg-bub">${safeText}</div><span class="msg-time">${time}</span></div>
      </div>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
