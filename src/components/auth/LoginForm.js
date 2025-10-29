// src/components/auth/LoginForm.js
'use client';

import { Suspense } from 'react';
import LoginFormContent from './LoginFormContent';

export default function LoginForm() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}