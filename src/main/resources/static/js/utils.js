// ── utils.js — Shared utilities ───────────────────────────────

// ── Toast ────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = (type === 'success' ? '✓  ' : type === 'error' ? '✕  ' : '·  ') + msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast-out');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

// ── Date format ───────────────────────────────────────────────
function fmtDate(dt) {
  if (!dt) return '';
  try {
    return new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dt; }
}

// ── File extension helpers ────────────────────────────────────
function getExt(filename) {
  if (!filename) return 'FILE';
  const ext = filename.split('.').pop().toUpperCase();
  return ext.length > 6 ? 'FILE' : ext;
}

function getTypeClass(filename) {
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'type-pdf';
  if (['txt', 'md', 'text'].includes(ext)) return 'type-txt';
  return 'type-other';
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── Show / hide spinner in button ────────────────────────────
function setBtnLoading(btn, text, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span><span>${text}</span>`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || text;
  }
}

// ── Session helpers ───────────────────────────────────────────
function getSession() {
  return {
    token: localStorage.getItem('dv_token'),
    role:  localStorage.getItem('dv_role'),
    email: localStorage.getItem('dv_email'),
  };
}
function saveSession(token, role, email) {
  localStorage.setItem('dv_token', token);
  localStorage.setItem('dv_role',  role);
  localStorage.setItem('dv_email', email);
}
function clearSession() {
  localStorage.removeItem('dv_token');
  localStorage.removeItem('dv_role');
  localStorage.removeItem('dv_email');
}