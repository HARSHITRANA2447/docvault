// ── auth.js — Login & Signup ──────────────────────────────────

// Tab switching
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'signup' && i === 1));
  });
  document.getElementById('form-login').style.display  = tab === 'login'  ? '' : 'none';
  document.getElementById('form-signup').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('signup-error').classList.remove('show');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}

// Login
async function doLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-btn');

  document.getElementById('login-error').classList.remove('show');

  if (!email || !password) { showError('login-error', 'Please fill in all fields.'); return; }

  setBtnLoading(btn, 'Sign in', true);
  try {
    const res = await api.login({ email, password });
    saveSession(res.token, res.role, res.email);
    bootApp();
    toast('Welcome back!', 'success');
  } catch (e) {
    showError('login-error', e.message || 'Invalid email or password.');
  } finally {
    setBtnLoading(btn, 'Sign in', false);
  }
}

// Signup
async function doSignup() {
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const btn      = document.getElementById('signup-btn');

  document.getElementById('signup-error').classList.remove('show');

  if (!name || !email || !password)   { showError('signup-error', 'Please fill in all fields.'); return; }
  if (password.length < 6)            { showError('signup-error', 'Password must be at least 6 characters.'); return; }

  setBtnLoading(btn, 'Create account', true);
  try {
    const res = await api.signup({ name, email, password });
    saveSession(res.token, res.role, res.email);
    bootApp();
    toast('Account created — welcome to DocVault!', 'success');
  } catch (e) {
    showError('signup-error', e.message || 'Signup failed. Try again.');
  } finally {
    setBtnLoading(btn, 'Create account', false);
  }
}

// Enter key support
document.getElementById('login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('login-email')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('signup-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') doSignup(); });