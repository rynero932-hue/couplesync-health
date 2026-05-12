// src/ui/toast.js
let _t = null;
export function toast(msg, dur = 2600) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_t);
  _t = setTimeout(() => el.classList.remove('show'), dur);
}

export function statusBar(msg, ok = null) {
  const el = document.getElementById('fb-bar');
  if (!el) return;
  const dot = ok === true ? '🟢' : ok === false ? '🔴' : '🟡';
  el.innerHTML = `${dot} ${msg}`;
  el.style.opacity = '1';
  if (ok !== null) setTimeout(() => { el.style.opacity = '0'; }, 2800);
}
