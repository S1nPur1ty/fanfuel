'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SignInButton, SignOutButton } from './AuthButtons';

export default function Navbar() {

  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">FanFuel</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-gray-600">
              Explore
            </Link>

            <Link
              href="/create-profile"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
            >
              <span className="mr-2">+</span>
              Become Artist
            </Link>

            {session ? (
              <SignOutButton />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 