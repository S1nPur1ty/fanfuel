'use client';

import { signIn, signOut } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      onClick={() => signIn('google', { 
        prompt: 'select_account',
        callbackUrl: window.location.href,
        redirect: true
      })}
      className="text-gray-900 hover:text-gray-600 cursor-pointer"
    >
      Sign in
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: window.location.href })}
      className="text-gray-900 hover:text-gray-600 cursor-pointer"
    >
      Sign out
    </button>
  );
} 