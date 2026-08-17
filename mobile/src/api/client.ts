import { getFullApiUrl, ENV } from '../config/env.ts';
import { getSecureItem, SECURE_KEYS, clearAuthSessionTokens } from '../storage/secureStore.ts';
import { isSafeReadEndpoint, getSafeReadCache, setSafeReadCache } from '../utils/cache.ts';

export interface ApiErrorPayload {
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: any;
}

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  details?: any;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.statusCode = payload.statusCode;
    this.errorCode = payload.errorCode;
    this.details = payload.details;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  idempotencyKey?: string;
  skipAuthToken?: boolean;
}

type UnauthorizedHandler = () => void;
let onUnauthorizedCallback: UnauthorizedHandler | null = null;
let isGlobalOffline = false;

// In-Flight GET Request Deduplication Map (CMD-072 Performance Optimization)
const inFlightRequests = new Map<string, Promise<any>>();

export function setClientOfflineMode(offline: boolean): void {
  isGlobalOffline = offline;
}

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorizedCallback = handler;
}

export function getInFlightRequestCount(): number {
  return inFlightRequests.size;
}

/**
 * Authoritative Centralized API Client with Offline Caching & In-Flight Request Deduplication (CMD-071 / CMD-072)
 * - Automatic Authorization: Bearer <token> injection from SecureStore
 * - X-Idempotency-Key header injection for state-mutating requests
 * - Safe Read Caching for non-sensitive GET endpoints when offline
 * - Concurrent In-Flight GET Request Deduplication (prevents request storms)
 * - Strict blocking of offline financial/mutation requests
 * - Zero client-side price or stock math
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();

  // 0. Offline Mode Interceptor (CMD-071)
  if (isGlobalOffline) {
    if (isSafeReadEndpoint(endpoint, method)) {
      const cached = getSafeReadCache<T>(endpoint);
      if (cached) {
        return {
          ...cached.data,
          _isStale: true,
          _cachedAt: cached.cachedAt,
        } as T;
      }
      throw new ApiError({
        statusCode: 0,
        message: 'Offline: Cached content unavailable for this view.',
        errorCode: 'OFFLINE_CACHE_MISS',
      });
    }

    // Block financial/mutation requests offline (CMD-071)
    throw new ApiError({
      statusCode: 0,
      message: 'Offline: Financial and state-mutating operations require an active internet connection.',
      errorCode: 'OFFLINE_MUTATION_BLOCKED',
    });
  }

  // 0b. Concurrent In-Flight GET Request Deduplication (CMD-072)
  const isGet = method === 'GET';
  const requestKey = `${method}:${endpoint}:${JSON.stringify(options.body || {})}`;

  if (isGet && inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey) as Promise<T>;
  }

  const executeRequest = async (): Promise<T> => {
    const url = getFullApiUrl(endpoint);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // 1. Auth Header Injection from SecureStore
    if (!options.skipAuthToken) {
      const token = await getSecureItem(SECURE_KEYS.ACCESS_TOKEN);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // 2. Idempotency Key Injection
    if (options.idempotencyKey) {
      headers['X-Idempotency-Key'] = options.idempotencyKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.signal ? undefined : ENV.requestTimeoutMs);
    if (timeoutId && typeof (timeoutId as any).unref === 'function') {
      (timeoutId as any).unref();
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        body: options.body
          ? typeof options.body === 'string'
            ? options.body
            : JSON.stringify(options.body)
          : undefined,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      // 3. Handle 401 Unauthorized globally
      if (response.status === 401) {
        await clearAuthSessionTokens();
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
        throw new ApiError({
          statusCode: 401,
          message: 'Session expired. Please log in again.',
          errorCode: 'UNAUTHORIZED',
        });
      }

      const contentType = response.headers.get('content-type');
      let responseData: any = null;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        const errorMessage = responseData?.message || `HTTP Request failed with status ${response.status}`;
        throw new ApiError({
          statusCode: response.status,
          message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
          errorCode: responseData?.errorCode || responseData?.error || 'API_ERROR',
          details: responseData,
        });
      }

      // Unwrap envelope if present, else return data verbatim
      let finalResult = responseData;
      if (responseData && typeof responseData === 'object' && 'data' in responseData && 'success' in responseData) {
        finalResult = responseData.data;
      }

      // Cache safe read GET responses
      if (isSafeReadEndpoint(endpoint, method) && finalResult) {
        setSafeReadCache(endpoint, finalResult);
      }

      return finalResult as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err.name === 'AbortError') {
        throw new ApiError({
          statusCode: 408,
          message: 'Network request timed out. Please check your connection.',
          errorCode: 'TIMEOUT',
        });
      }
      throw new ApiError({
        statusCode: 500,
        message: err.message || 'An unexpected network error occurred.',
        errorCode: 'NETWORK_ERROR',
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const requestPromise = executeRequest();

  if (isGet) {
    inFlightRequests.set(requestKey, requestPromise);
    requestPromise
      .finally(() => {
        inFlightRequests.delete(requestKey);
      })
      .catch(() => {});
  }

  return requestPromise;
}
