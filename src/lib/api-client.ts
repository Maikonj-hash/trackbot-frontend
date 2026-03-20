import Cookies from 'js-cookie';
import { API_URL } from './constants';

export const AUTH_TOKEN_KEY = 'trackbot_auth_token';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const token = Cookies.get(AUTH_TOKEN_KEY);

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  let url = `${API_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Redirecionar para login se o token for inválido/expirado
    Cookies.remove(AUTH_TOKEN_KEY);
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return response;
}

export const api = {
  get: (endpoint: string, options?: FetchOptions) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: FetchOptions) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
  logout: () => {
    Cookies.remove(AUTH_TOKEN_KEY);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};
