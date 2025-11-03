import api from '../api/axios';

const ACCESS_KEY = 'rbac_access';
const REFRESH_KEY = 'rbac_refresh';
const USER_KEY = 'rbac_user';

export function saveAuth({ accessToken, refreshToken, user }) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  };
}

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(credentials) {
  const resp = await api.post('/auth/login', credentials);
  const { accessToken, refreshToken, user } = resp.data;
  saveAuth({ accessToken, refreshToken, user });
  return resp.data;
}

export async function logout() {
  const { refreshToken } = getAuthTokens();
  try {
    await api.post('/auth/logout', { refreshToken });
  } catch (e) {
    // ignore
  }
  clearAuth();
}
