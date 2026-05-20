import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, LoginPayload, RegisterPayload } from '@/lib/types';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await api.getCurrentUser();
        setUser(user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      setError(null);
      const { user } = await api.login(payload);
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, [router]);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      setError(null);
      const { user } = await api.register(payload);
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await api.logout();
      setUser(null);
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
  };
}
