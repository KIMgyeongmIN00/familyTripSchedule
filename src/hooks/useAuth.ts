'use client';

import { useState, useEffect, useCallback, useRef, startTransition } from 'react';
import { STORAGE_KEY } from '@/lib/constants';

interface AuthState {
  name: string;
  authenticated: boolean;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthState;
        if (parsed.authenticated) {
          startTransition(() => {
            setAuthState(parsed);
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    startTransition(() => {
      setIsLoading(false);
    });
  }, []);

  const login = useCallback((name: string, password: string): boolean => {
    const correctPassword = process.env.NEXT_PUBLIC_ACCESS_PASSWORD;

    if (password === correctPassword) {
      const newState: AuthState = { name, authenticated: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setAuthState(newState);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState(null);
  }, []);

  return {
    isLoading,
    isAuthenticated: authState?.authenticated ?? false,
    userName: authState?.name ?? '',
    login,
    logout,
  };
}
