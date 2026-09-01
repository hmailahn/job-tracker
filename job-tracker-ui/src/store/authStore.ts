import { create } from 'zustand';
import client from '../api/client';
import type { AuthUser, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
}

function loadUser(): AuthUser | null {
  const email = localStorage.getItem('email');
  const displayName = localStorage.getItem('displayName');
  return email && displayName ? { email, displayName } : null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: loadUser(),

  login: async (req) => {
    const res = await client.post<AuthResponse>('/auth/login', req);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    localStorage.setItem('displayName', res.data.displayName);
    set({ user: { email: res.data.email, displayName: res.data.displayName } });
  },

  register: async (req) => {
    const res = await client.post<AuthResponse>('/auth/register', req);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    localStorage.setItem('displayName', res.data.displayName);
    set({ user: { email: res.data.email, displayName: res.data.displayName } });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    set({ user: null });
  },

  isLoggedIn: () => !!localStorage.getItem('token'),
}));