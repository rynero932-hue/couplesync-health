// src/screens/chat.js
import { state }        from '../state.js';
import { sendMsg, listenChat } from '../firebase/db.js';
import { toast }        from '../ui/toast.js';

const FALLBACK_REPLIES = [
  'Semangat terus ya sayang! 💜',
  'Proud of you banget 🥰',
  'Ayo kita bisa! 💪',
  'Kamu yang terbaik! 🌟',
  'I miss you 💜',
];

let _unsubChat = null;

export function initChat() {
  _unsubChat?.();
  _unsubChat = listenChat(snap => renderMessages(snap));
}

function renderMessages(snap) {
  const msgs = document.getElementById('chat-msgs');
  if (!msgs) return;
  msgs.innerHTML = '';
  snap.forEach(d => {
    const data  = d.data();
    const isMe  = data.sender === state.me;
    const time  = data.createdAt?.toDate
      ? data.createdAt.toDate().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })
      : '';
    appendBubble(msgs, safe(data.text), isMe, time);
  });
  msgs.scrollTop = msgs.scrollHeight;
}

export async function sendChat() {
  const input = document.getElementById('chat-in');
  const text  = input?.value.trim() ?? '';
  if (!text) return;
  input.value = '';

  try {
    await sendMsg(text);
  } catch (err) {
    // Offline fallback
    const msgs = document.getElementById('chat-msgs');
    if (msgs) {
      appendBubble(msgs, safe(text), true, now());
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(() => {
        const reply = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
        appendBubble(msgs, reply, false, now());
        msgs.scrollTop = msgs.scrollHeight;
      }, 1200);
    }
  }
}

export function sendCheer(msg) {
  const input = document.getElementById('chat-in');
  if (input) input.value = msg;
  sendChat();
}

function appendBubble(container, text, isMe, time) {
  const div = document.createElement('div');
  div.className = 'msg ' + (isMe ? 'me' : 'them');
  if (isMe) {
    div.innerHTML = `<div class="msg-bub">${text}</div><span class="msg-time">${time}</span>`;
  } else {
    const pu   = state.partnerUser;
    const init = pu?.initial ?? '?';
    const cls  = pu?.colorClass ?? 'm';
    div.innerHTML = `
      <div class="chat-av-row">
        <div class="chat-av ${cls}">${init}</div>
        <div><div class="msg-bub">${text}</div><span class="msg-time">${time}</span></div>
      </div>`;
  }
  container.appendChild(div);
}

const safe = s => String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;');
const now  = () => new Date().toLocaleTimeString('id',{hour:'2-digit',minute:'2-digit'});
