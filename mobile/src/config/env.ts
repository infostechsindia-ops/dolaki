export interface AppEnvConfig {
  apiBaseUrl: string;
  apiVersion: string;
  defaultSurface: 'MARKETPLACE' | 'QUICK_COMMERCE';
  requestTimeoutMs: number;
  maxRetryAttempts: number;
}

let ConstantsModule: any = null;
try {
  ConstantsModule = require('expo-constants');
} catch (e) {
  // Safe fallback in non-Expo environment
}

const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  const debuggerHost = ConstantsModule?.default?.expoConfig?.hostUri || ConstantsModule?.expoConfig?.hostUri || '';
  const extractedHost = debuggerHost ? debuggerHost.split(':')[0] : '';
  const host = extractedHost || 'localhost';
  return `http://${host}:3000`;
};

export const ENV: AppEnvConfig = {
  apiBaseUrl: getApiBaseUrl(),
  apiVersion: '/api/v1',
  defaultSurface: 'MARKETPLACE',
  requestTimeoutMs: 10000,
  maxRetryAttempts: 2,
};

export const getFullApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api/v1')) {
    return `${ENV.apiBaseUrl}${cleanEndpoint}`;
  }
  return `${ENV.apiBaseUrl}${ENV.apiVersion}${cleanEndpoint}`;
};
