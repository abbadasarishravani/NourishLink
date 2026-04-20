export function getToken() {
  return localStorage.getItem('token') || '';
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (!user) return;
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-changed'));
}

export function setAuth({ token, user }) {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-changed'));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-changed'));
}

export function isAuthed() {
  return Boolean(getToken());
}
