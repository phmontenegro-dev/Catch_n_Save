import { create } from 'zustand';
import { setAccessToken, setRefreshToken, getRefreshToken } from '../lib/api/client';
import { authApi } from '../lib/api/auth.api';
import type { AuthResponse, User } from '../lib/api/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  // Ações
  setSession: (response: AuthResponse) => void;
  clearSession: () => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,

  setSession: (response: AuthResponse) => {
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    set({
      user: response.user,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    setAccessToken(null);
    setRefreshToken(null);
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  hydrate: async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      set({ isHydrated: true });
      return;
    }

    set({ isLoading: true });

    try {
      // Como access token é em memória, ele se perdeu no reload.
      // Fazemos uma chamada ao /users/me que vai disparar 401 → refresh automático.
      const user = await authApi.getMe();
      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      // Refresh falhou ou outro erro → sessão morta
      get().clearSession();
    } finally {
      set({ isLoading: false, isHydrated: true });
    }
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignora erro de logout — sempre limpa local de qualquer forma
    } finally {
      get().clearSession();
    }
  },
}));
