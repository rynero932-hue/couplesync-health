// src/screens/chat.js

import { state }            from '../state.js';
import { sendChatMessage }  from '../firebase/firestore.js';
import { AUTO_REPLIES }     from '../data/workouts.js';

export async function sendChat() {
  const input = document.getElementById('chat-in');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  try {
    await sendChatMessage(text);
    // Firestore listener (startChatListener) will re-render the messages
  } catch (err) {
    console.error('[sendChat]', err);
    // Offline fallback — append locally
    appendLocal(text, true);
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      appendLocal(reply, false);
    }, 1100);
  }
}

export function sendCheer(msg) {
  document.getElementById('chat-in').value = msg;
  sendChat();
}

function appendLocal(text, isMe) {
  const msgs = document.getElementById('chat-msgs');
  if (!msgs) return;
  const time = new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' });
  const div  = document.createElement('div');
  div.className = 'msg ' + (isMe ? 'me' : 'them');

  if (isMe) {
    div.innerHTML = `<div class="msg-bub">${text}</div><span class="msg-time">${time}</span>`;
  } else {
    const pRole = state.currentUser === 'm' ? 'f' : 'm';
    const init  = pRole === 'f' ? 'N' : 'I';
    div.innerHTML = `
      <div class="chat-av-row">
        <div class="chat-smav ${pRole}">${init}</div>
        <div>
          <div class="msg-bub">${text}</div>
          <span class="msg-time">${time}</span>
        </div>
      </div>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
