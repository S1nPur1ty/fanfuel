'use client';

import { signIn, signOut } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="text-gray-900 hover:text-gray-600"
    >
      Sign in
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-gray-900 hover:text-gray-600"
    >
      Sign out
    </button>
  );
} 