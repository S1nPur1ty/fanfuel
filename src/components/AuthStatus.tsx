'use client';

import { useSession } from 'next-auth/react';

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <img 
          src={session.user?.image ?? ''} 
          alt={session.user?.name ?? ''} 
          className="w-8 h-8 rounded-full"
        />
      </div>
    );
  }

  return <div>Not signed in</div>;
} 