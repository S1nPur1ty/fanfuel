'use client';

import { SessionProvider } from "next-auth/react";
import { WagmiProvider } from "@/components/providers/WagmiProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WagmiProvider>
        {children}
      </WagmiProvider>
    </SessionProvider>
  );
} 