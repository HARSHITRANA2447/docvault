// ── api.js — All backend calls ────────────────────────────────
const API_BASE = '';  // Same origin — Spring Boot serves both frontend & backend

async function request(path, options = {}) {
  const token = localStorage.getItem('dv_token');
  const headers = { ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_BASE + path, { ...options, headers });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = '/';
    return;
  }

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    throw new Error(data?.error || data || `Request failed (${res.status})`);
  }
  return data;
}

const api = {
  // Auth
  login:  (body) => request('/auth/login',  { method: 'POST', body: JSON.stringify(body) }),
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  // User
  upload:    (formData) => request('/user/upload',    { method: 'POST', body: formData }),
  myDocs:    ()         => request('/user/documents', { method: 'GET' }),

  // Admin
  allUsers:       ()        => request('/admin/users',         { method: 'GET' }),
  allDocs:        ()        => request('/admin/documents',     { method: 'GET' }),
  updateUser:     (id, body) => request(`/admin/user/${id}`,    { method: 'PUT', body: JSON.stringify(body) }),
  updateDocument: (id, body) => request(`/admin/document/${id}`,{ method: 'PUT', body: JSON.stringify(body) }),
};