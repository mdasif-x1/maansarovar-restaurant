import { AuthResponse } from '../types';
import { fetchApi } from './api';

export async function loginAdmin(username: string, password: string): Promise<AuthResponse> {
  const data = await fetchApi<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (data.token) {
    localStorage.setItem('maansarovar_jwt', data.token);
  }
  return data;
}

export async function getCurrentUserAdmin(): Promise<AuthResponse> {
  return await fetchApi<AuthResponse>('/api/v1/auth/me');
}

export async function logoutAdmin(): Promise<void> {
  try {
    const token = localStorage.getItem('maansarovar_jwt');
    if (token) {
      await fetchApi<void>('/api/v1/auth/logout', { method: 'POST' });
    }
  } catch (err) {
    // Non-blocking: ensure local session is always wiped even if network fails
    console.warn('Server logout notification error:', err);
  } finally {
    localStorage.removeItem('maansarovar_jwt');
  }
}

export function getToken(): string | null {
  return localStorage.getItem('maansarovar_jwt');
}
