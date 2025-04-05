'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
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
              Home
            </Link>
            <Link href="/explore" className="text-gray-900 hover:text-gray-600">
              Explore
            </Link>
            <Link 
              href="/create" 
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
            >
              Create
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 