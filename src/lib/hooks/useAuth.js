// src/lib/hooks/useAuth.js
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 */
export function useAuth(options = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { requireAuth = false, redirectTo = '/login' } = options;

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  // Redirect if auth is required but user is not authenticated
  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [requireAuth, isLoading, isAuthenticated, redirectTo, router]);

  const login = async (email, password, callbackUrl = '/dashboard') => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      router.push(callbackUrl);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async (callbackUrl = '/') => {
    try {
      await signOut({ redirect: false });
      router.push(callbackUrl);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during logout' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      // Auto-login after registration
      return await login(userData.email, userData.password);
    } catch (error) {
      return { success: false, error: 'An error occurred during registration' };
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    session,
  };
}

/**
 * HOC to protect routes that require authentication
 */
export function withAuth(Component, options = {}) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth({ 
      requireAuth: true,
      ...options 
    });

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
}