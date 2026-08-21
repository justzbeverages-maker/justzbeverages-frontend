const AUTH_KEY = "justz_admin_auth"; // stores base64("user:pass") in sessionStorage

// Call this from any fetch/axios request that hits a protected admin endpoint:
//   headers: { Authorization: getAdminAuthHeader() }
export function getAdminAuthHeader() {
  const token = sessionStorage.getItem(AUTH_KEY);
  return token ? `Basic ${token}` : null;
}

export function isAdminAuthed() {
  return !!sessionStorage.getItem(AUTH_KEY);
}

export function setAdminAuth(token) {
  sessionStorage.setItem(AUTH_KEY, token);
}

export function clearAdminAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

// Drop-in replacement for fetch() when calling protected admin endpoints
// (POST/PUT/DELETE on /admin, /api/hero, /api/products). Attaches the
// Basic Auth header automatically and fires "admin-unauthorized" on a
// 401/403 so AdminPanel can bounce the user back to the login screen.
export async function authedFetch(url, options = {}) {
  const auth = getAdminAuthHeader();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(auth ? { Authorization: auth } : {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    window.dispatchEvent(new Event("admin-unauthorized"));
  }

  return res;
}