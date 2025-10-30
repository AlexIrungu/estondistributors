// src/components/SessionProvider.js
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children }) {
  return (
    <NextAuthSessionProvider
      // Don't auto-fetch session on mount to avoid redirect loops
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}