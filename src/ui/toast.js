// src/ui/toast.js

let _timer = null;

export function showToast(msg, duration = 2400) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_timer);
  _timer = setTimeout(() => el.classList.remove('show'), duration);
}

export function fbBar(msg, ok = null) {
  const el = document.getElementById('fb-bar');
  if (!el) return;
  const dot = ok === true ? '🟢' : ok === false ? '🔴' : '🟡';
  el.innerHTML     = `${dot} ${msg}`;
  el.style.opacity = '1';
  if (ok !== null) setTimeout(() => { el.style.opacity = '0'; }, 2800);
}
