// ── app.js — Main application controller ─────────────────────

// ── Navigation ────────────────────────────────────────────────
const USER_PAGES = [
  { id: 'page-upload', label: 'Upload', icon: '⬆', load: null },
  { id: 'page-docs',   label: 'My Documents', icon: '📄', load: loadMyDocs },
];
const ADMIN_PAGES = [
  { id: 'page-admin-users', label: 'Users',     icon: '👥', load: loadAdminUsers },
  { id: 'page-admin-docs',  label: 'Documents', icon: '🗂', load: loadAdminDocs },
];

function buildNav(role) {
  const pages = role === 'ADMIN' ? ADMIN_PAGES : USER_PAGES;
  const nav   = document.getElementById('sidebar-nav');
  nav.innerHTML = pages.map(p => `
    <button class="nav-item" data-page="${p.id}" onclick="showPage('${p.id}')">
      <span class="nav-icon">${p.icon}</span>${p.label}
    </button>
  `).join('');
  showPage(pages[0].id);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === pageId);
  });
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  // Call load function if defined
  const role   = getSession().role;
  const pages  = role === 'ADMIN' ? ADMIN_PAGES : USER_PAGES;
  const match  = pages.find(p => p.id === pageId);
  if (match?.load) match.load();
}

// ── Boot App ──────────────────────────────────────────────────
function bootApp() {
  const { token, role, email } = getSession();
  if (!token) return;

  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').style.display  = 'flex';

  document.getElementById('sb-role').textContent  = role;
  document.getElementById('sb-email').textContent = email;

  buildNav(role);
}

// ── Logout ────────────────────────────────────────────────────
function doLogout() {
  clearSession();
  document.getElementById('app-screen').style.display  = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  // Reset forms
  ['login-email','login-password','signup-name','signup-email','signup-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  switchTab('login');
}

// ── Upload Page ───────────────────────────────────────────────
let chosenFile = null;

function setupUpload() {
  const zone  = document.getElementById('upload-zone');
  const input = document.getElementById('file-input');

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if (f) setChosenFile(f);
  });

  input.addEventListener('change', () => {
    if (input.files[0]) setChosenFile(input.files[0]);
  });
}

function setChosenFile(file) {
  chosenFile = file;
  const nameEl = document.getElementById('chosen-file-name');
  nameEl.textContent = `📎 ${file.name}`;
  nameEl.style.display = 'inline-block';
  document.getElementById('upload-btn').disabled = false;
  document.getElementById('clear-btn').style.display = '';
}

function clearFile() {
  chosenFile = null;
  document.getElementById('file-input').value = '';
  document.getElementById('chosen-file-name').style.display = 'none';
  document.getElementById('upload-btn').disabled = true;
  document.getElementById('clear-btn').style.display = 'none';
  document.getElementById('upload-result').innerHTML = '';
}

async function doUpload() {
  if (!chosenFile) return;

  const btn      = document.getElementById('upload-btn');
  const progress = document.getElementById('upload-progress');
  const bar      = document.getElementById('upload-bar');

  setBtnLoading(btn, 'Upload & Summarize', true);
  progress.classList.add('show');

  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.random() * 16, 88);
    bar.style.width = pct + '%';
  }, 200);

  try {
    const formData = new FormData();
    formData.append('file', chosenFile);
    const doc = await api.upload(formData);

    clearInterval(iv); bar.style.width = '100%';
    setTimeout(() => { progress.classList.remove('show'); bar.style.width = '0%'; }, 500);

    toast('Document uploaded and summarized!', 'success');
    showUploadResult(doc);
    clearFile();
  } catch (e) {
    clearInterval(iv); progress.classList.remove('show'); bar.style.width = '0%';
    toast(e.message || 'Upload failed.', 'error');
  } finally {
    setBtnLoading(btn, 'Upload & Summarize', false);
    document.getElementById('upload-btn').disabled = !chosenFile;
  }
}

function showUploadResult(doc) {
  const el = document.getElementById('upload-result');
  el.innerHTML = `
    <div class="result-card">
      <div class="result-card-header">
        <span class="doc-type-pill ${getTypeClass(doc.fileName)}">${getExt(doc.fileName)}</span>
        <div>
          <div class="result-filename">${doc.fileName}</div>
          <div class="result-meta">${fmtDate(doc.uploadedAt)} · just uploaded</div>
        </div>
        <div style="margin-left:auto">
          <span class="badge badge-sage">✓ Ready</span>
        </div>
      </div>
      <div class="divider" style="margin-bottom:1rem"></div>
      <div class="result-summary-label">AI Summary</div>
      <div class="result-summary">${doc.summary || 'No summary available.'}</div>
    </div>`;
}

// ── My Documents Page ─────────────────────────────────────────
async function loadMyDocs() {
  const container = document.getElementById('my-docs-grid');
  const count     = document.getElementById('my-docs-count');
  const searchEl  = document.getElementById('docs-search');

  container.innerHTML = `<div class="empty-state"><div class="empty-icon" style="animation:spin 1.5s linear infinite">⏳</div><div class="empty-title">Loading…</div></div>`;

  try {
    const docs = await api.myDocs();

    count.textContent = docs.length + ' document' + (docs.length !== 1 ? 's' : '') + ' in your vault';

    // Search
    searchEl.oninput = () => renderDocs(docs, searchEl.value);
    renderDocs(docs, '');
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-sub">${e.message}</div></div>`;
  }
}

function renderDocs(docs, query) {
  const container = document.getElementById('my-docs-grid');
  const q = query.toLowerCase();
  const filtered = docs.filter(d =>
    (d.fileName || '').toLowerCase().includes(q) ||
    (d.summary  || '').toLowerCase().includes(q)
  );

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">${query ? '🔍' : '🗂'}</div>
      <div class="empty-title">${query ? 'No matches' : 'No documents yet'}</div>
      <div class="empty-sub">${query ? 'Try a different search.' : 'Head to Upload to add your first file.'}</div>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map((doc, i) => `
    <div class="card card-hover doc-card fade-up fade-up-${Math.min(i+1,5)}">
      <div class="doc-card-header">
        <span class="doc-type-pill ${getTypeClass(doc.fileName)}">${getExt(doc.fileName)}</span>
        <div style="flex:1;min-width:0">
          <div class="doc-name">${doc.fileName}</div>
          <div class="doc-meta">${fmtDate(doc.uploadedAt)}</div>
        </div>
      </div>
      <div class="divider" style="margin-bottom:0.9rem"></div>
      <div class="doc-summary-label">AI Summary</div>
      <div class="doc-summary" id="sum-${i}">${doc.summary || 'No summary available.'}</div>
      ${(doc.summary || '').length > 220 ? `<button class="doc-expand-btn" onclick="toggleSummary('sum-${i}', this)">↓ read more</button>` : ''}
    </div>`).join('');
}

function toggleSummary(id, btn) {
  const el = document.getElementById(id);
  const expanded = el.classList.toggle('expanded');
  btn.textContent = expanded ? '↑ show less' : '↓ read more';
}

// ── Admin Users Page ──────────────────────────────────────────
let _allUsers = [];

async function loadAdminUsers() {
  const tbody       = document.getElementById('users-tbody');
  const searchEl    = document.getElementById('users-search');
  tbody.innerHTML   = `<tr><td colspan="4" class="empty-state" style="border:none;padding:3rem">Loading…</td></tr>`;

  try {
    _allUsers = await api.allUsers();

    // Stats
    document.getElementById('stat-users-total').textContent = _allUsers.length;
    document.getElementById('stat-users-regular').textContent = _allUsers.filter(u => u.role === 'USER').length;
    document.getElementById('stat-users-admin').textContent = _allUsers.filter(u => u.role === 'ADMIN').length;

    searchEl.oninput = () => renderUsersTable(_allUsers, searchEl.value);
    renderUsersTable(_allUsers, '');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" style="padding:2rem;color:var(--error)">${e.message}</td></tr>`;
  }
}

function renderUsersTable(users, query) {
  const tbody = document.getElementById('users-tbody');
  const q = query.toLowerCase();
  const filtered = users.filter(u =>
    (u.name  || '').toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q)
  );

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">👥</div><div class="empty-title">No users found</div></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td><strong>${u.name || '—'}</strong></td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem">${u.email}</td>
      <td>
        <span class="badge ${u.role === 'ADMIN' ? 'badge-terra' : 'badge-sage'}">${u.role}</span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openEditUser('${u.id}','${esc(u.name)}','${esc(u.email)}','${u.role}')">
          Edit
        </button>
      </td>
    </tr>`).join('');
}

function openEditUser(id, name, email, role) {
  document.getElementById('edit-user-id').value    = id;
  document.getElementById('edit-user-name').value  = name;
  document.getElementById('edit-user-email').value = email;
  document.getElementById('edit-user-role').value  = role;
  openModal('modal-edit-user');
}

async function saveUser() {
  const id    = document.getElementById('edit-user-id').value;
  const name  = document.getElementById('edit-user-name').value.trim();
  const email = document.getElementById('edit-user-email').value.trim();
  const role  = document.getElementById('edit-user-role').value;
  const btn   = document.getElementById('save-user-btn');

  setBtnLoading(btn, 'Save changes', true);
  try {
    await api.updateUser(id, { name, email, role });
    toast('User updated successfully', 'success');
    closeModal('modal-edit-user');
    loadAdminUsers();
  } catch (e) {
    toast(e.message || 'Update failed', 'error');
  } finally {
    setBtnLoading(btn, 'Save changes', false);
  }
}

// ── Admin Documents Page ──────────────────────────────────────
async function loadAdminDocs() {
  const tbody    = document.getElementById('docs-tbody');
  const searchEl = document.getElementById('adocs-search');
  tbody.innerHTML = `<tr><td colspan="5" style="padding:2rem;color:var(--ink-muted)">Loading…</td></tr>`;

  try {
    const docs = await api.allDocs();
    const withSummary = docs.filter(d => d.summary && d.summary.trim()).length;

    document.getElementById('stat-docs-total').textContent = docs.length;
    document.getElementById('stat-docs-summ').textContent  = withSummary;
    document.getElementById('stat-docs-pend').textContent  = docs.length - withSummary;

    searchEl.oninput = () => renderDocsTable(docs, searchEl.value);
    renderDocsTable(docs, '');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:2rem;color:var(--error)">${e.message}</td></tr>`;
  }
}

function renderDocsTable(docs, query) {
  const tbody = document.getElementById('docs-tbody');
  const q = query.toLowerCase();
  const filtered = docs.filter(d =>
    (d.fileName   || '').toLowerCase().includes(q) ||
    (d.uploadedBy || '').toLowerCase().includes(q)
  );

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🗂</div><div class="empty-title">No documents found</div></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(d => `
    <tr>
      <td><span class="doc-type-pill ${getTypeClass(d.fileName)}">${getExt(d.fileName)}</span></td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.fileName}</td>
      <td style="font-size:0.82rem;color:var(--ink-dim)">${d.uploadedBy}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--ink-muted)">${fmtDate(d.uploadedAt)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.78rem;color:var(--ink-dim)">${d.summary || '—'}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openEditDoc('${d.id}','${esc(d.fileName)}',\`${esc(d.summary || '')}\`)">
          Edit
        </button>
      </td>
    </tr>`).join('');
}

function openEditDoc(id, fileName, summary) {
  document.getElementById('edit-doc-id').value       = id;
  document.getElementById('edit-doc-name').value     = fileName;
  document.getElementById('edit-doc-summary').value  = summary;
  openModal('modal-edit-doc');
}

async function saveDoc() {
  const id       = document.getElementById('edit-doc-id').value;
  const fileName = document.getElementById('edit-doc-name').value.trim();
  const summary  = document.getElementById('edit-doc-summary').value.trim();
  const btn      = document.getElementById('save-doc-btn');

  setBtnLoading(btn, 'Save changes', true);
  try {
    await api.updateDocument(id, { fileName, summary });
    toast('Document updated successfully', 'success');
    closeModal('modal-edit-doc');
    loadAdminDocs();
  } catch (e) {
    toast(e.message || 'Update failed', 'error');
  } finally {
    setBtnLoading(btn, 'Save changes', false);
  }
}

// ── Helpers ───────────────────────────────────────────────────
function esc(str) {
  return (str || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/`/g,'\\`').replace(/"/g,'&quot;');
}

// ── Init ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const { token } = getSession();
  if (token) {
    bootApp();
  }
  setupUpload();
});