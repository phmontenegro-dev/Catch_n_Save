import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

// --------------------------------------------------
// Gerenciamento de tokens em memória + localStorage
// --------------------------------------------------

let accessTokenMemory: string | null = null;

export function setAccessToken(token: string | null) {
  accessTokenMemory = token;
}

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

const REFRESH_STORAGE_KEY = 'cns.refresh_token';

export function setRefreshToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(REFRESH_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_STORAGE_KEY);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_STORAGE_KEY);
}

// --------------------------------------------------
// Instância axios
// --------------------------------------------------

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --------------------------------------------------
// Interceptor de requisição: adiciona Authorization
// --------------------------------------------------

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------------------------------------
// Interceptor de resposta: refresh automático em 401
// --------------------------------------------------

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Sem refresh token disponível');
  }

  const response = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${API_URL}/auth/refresh`,
    { refreshToken },
  );

  setAccessToken(response.data.accessToken);
  setRefreshToken(response.data.refreshToken);

  return response.data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    // Só tenta refresh se: 401 + não é retry + não é endpoint de auth
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    const shouldAttemptRefresh =
      error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint;

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Dedupe: se já há refresh em andamento, aguarda ele
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      // Reexecuta requisição original com novo token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh falhou → sessão morreu
      setAccessToken(null);
      setRefreshToken(null);

      // Redireciona para login (se estiver no browser)
      if (typeof window !== 'undefined') {
        window.location.href = '/entrar';
      }

      return Promise.reject(refreshError);
    }
  },
);
