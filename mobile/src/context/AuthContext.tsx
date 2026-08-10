import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getSecureItem,
  setSecureItem,
  removeSecureItem,
  clearAuthSessionTokens,
  SECURE_KEYS,
} from '../storage/secureStore';
import { registerUnauthorizedHandler } from '../api/client';

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserSession | null;
  token: string | null;
  isLoading: boolean;
  setSession: (token: string, user: UserSession, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = async () => {
    try {
      const savedToken = await getSecureItem(SECURE_KEYS.ACCESS_TOKEN);
      const savedUserStr = await getSecureItem(SECURE_KEYS.USER_SESSION);
      if (savedToken && savedUserStr) {
        setToken(savedToken);
        setUser(JSON.parse(savedUserStr));
      }
    } catch (e) {
      await clearAuthSessionTokens();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const logout = async () => {
    await clearAuthSessionTokens();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  const setSession = async (accessToken: string, userSession: UserSession, refreshToken?: string) => {
    await setSecureItem(SECURE_KEYS.ACCESS_TOKEN, accessToken);
    await setSecureItem(SECURE_KEYS.USER_SESSION, JSON.stringify(userSession));
    if (refreshToken) {
      await setSecureItem(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    setToken(accessToken);
    setUser(userSession);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        user,
        token,
        isLoading,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
