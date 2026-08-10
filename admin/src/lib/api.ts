import { API_BASE_URL } from './config';

export const API_PREFIX = `${API_BASE_URL}/api/v1`;

export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any[];
  };
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${API_PREFIX}${cleanPath}`;

  const res = await fetch(url, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    const errorBody: ApiError = json;
    const msg =
      errorBody.error?.message ||
      `Admin API call failed with status ${res.status}`;
    throw new Error(msg);
  }

  // Unwrap standardized response envelope if present
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}

export const adminApi = {
  get: <T>(path: string, options?: RequestInit) =>
    adminFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: any, options?: RequestInit) =>
    adminFetch<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body?: any, options?: RequestInit) =>
    adminFetch<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: RequestInit) =>
    adminFetch<T>(path, { ...options, method: 'DELETE' }),
};
