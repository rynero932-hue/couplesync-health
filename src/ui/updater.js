// src/ui/updater.js
// All DOM update functions — called by firestore.js after data loads

import { state } from '../state.js';

function $(id) { return document.getElementById(id); }
function setTxt(id, val) { const el = $(id); if (el) el.textContent = val; }

export const updateUI = {

  // ── Dashboard cards ─────────────────────────────────────────────────────────
  dashboard(wm, wf, couple) {
    // Weight cards
    if (wm) {
      setTxt('hm-wm', `${wm.kg} kg`);
      const el = $('hm-wm-d');
      if (el) { el.textContent = `${wm.diff <= 0 ? '' : '+'}${wm.diff} kg`; el.className = 'hm-wcard-diff ' + (wm.diff <= 0 ? 'neg' : 'pos'); }
    }
    if (wf) {
      setTxt('hm-wf', `${wf.kg} kg`);
      const el = $('hm-wf-d');
      if (el) { el.textContent = `${wf.diff <= 0 ? '' : '+'}${wf.diff} kg`; el.className = 'hm-wcard-diff ' + (wf.diff <= 0 ? 'neg' : 'pos'); }
    }
    // Streak
    const streak = couple.streak ?? state.streak ?? 12;
    setTxt('hm-streak-num', streak);
    setTxt('streak-big-num', streak);
    // Water
    const waterDisp = $('water-disp');
    if (waterDisp) waterDisp.textContent = state.waterCount;
  },

  // ── AI context chips ─────────────────────────────────────────────────────────
  aiContext(wm, wf, couple) {
    const chips = $('ai-ctx-chips');
    if (!chips) return;
    chips.innerHTML = `
      <span class="ai-ctx-chip">Ilham ${wm ? wm.kg + 'kg' : '68.7kg'}</span>
      <span class="ai-ctx-chip">Navisa ${wf ? wf.kg + 'kg' : '55.2kg'}</span>
      <span class="ai-ctx-chip">Streak ${couple.streak ?? 12} hari</span>
      <span class="ai-ctx-chip">Air ${state.waterCount}/8</span>`;
  },

  // ── Chat messages ────────────────────────────────────────────────────────────
  chat(snap) {
    const msgs = $('chat-msgs');
    if (!msgs) return;
    msgs.innerHTML = '';
    snap.forEach(d => {
      const data  = d.data();
      const isMe  = data.sender === state.currentUser;
      const time  = data.createdAt?.toDate
        ? data.createdAt.toDate().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })
        : '';
      const div = document.createElement('div');
      div.className = 'msg ' + (isMe ? 'me' : 'them');
      if (isMe) {
        div.innerHTML = `<div class="msg-bub">${escapeHtml(data.text)}</div><span class="msg-time">${time}</span>`;
      } else {
        const cl   = data.sender === 'f' ? 'f' : 'm';
        const init = data.sender === 'f' ? 'N' : 'I';
        div.innerHTML = `
          <div class="chat-av-row">
            <div class="chat-smav ${cl}">${init}</div>
            <div>
              <div class="msg-bub">${escapeHtml(data.text)}</div>
              <span class="msg-time">${time}</span>
            </div>
          </div>`;
      }
      msgs.appendChild(div);
    });
    msgs.scrollTop = msgs.scrollHeight;
  },

  // ── Partner status (home screen) ─────────────────────────────────────────────
  partnerStatus(data) {
    const el = $('hm-active-status');
    if (!el) return;
    if (data.workoutDone)       el.textContent = 'Workout ✅ selesai!';
    else if ((data.water ?? 0) > 0) el.textContent = `Air minum: ${data.water}/8 💧`;
    else                            el.textContent = 'Aktif sekarang';
  },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
