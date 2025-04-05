# Wagmi Setup for Next.js 15

This guide explains how to set up and use [wagmi](https://wagmi.sh/) with Next.js 15 for Ethereum interactions.

## Installation

Install the required dependencies:

```bash
npm install wagmi viem @tanstack/react-query
```

## Configuration

### 1. Create a Wagmi Configuration

Create a file at `src/lib/wagmi.ts` with the following content:

```typescript
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

// Get your WalletConnect project ID from https://cloud.walletconnect.com/
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Configure chains & providers
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Export types
export type Config = typeof config;
```

### 2. Create a WagmiProvider Component

Create a file at `src/components/providers/WagmiProvider.tsx`:

```typescript
'use client';

import { WagmiProvider as BaseWagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient();

interface WagmiProviderProps {
  children: ReactNode;
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <BaseWagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BaseWagmiProvider>
  );
}
```

### 3. Add the Provider to Your App

Update your `src/app/providers.tsx` file to include the WagmiProvider:

```typescript
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
```

## Usage

### Wallet Connection

Create a custom hook for wallet connection at `src/hooks/useWallet.ts`:

```typescript
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = async (connectorId: 'injected' | 'metaMask' | 'walletConnect') => {
    let connector;
    
    switch (connectorId) {
      case 'injected':
        connector = injected();
        break;
      case 'metaMask':
        connector = metaMask();
        break;
      case 'walletConnect':
        connector = walletConnect();
        break;
      default:
        throw new Error('Unsupported connector');
    }
    
    connect({ connector });
  };

  return {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    connectors,
    error
  };
}
```

### Contract Interactions

Create a custom hook for contract interactions at `src/hooks/useContract.ts`:

```typescript
'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface ContractConfig {
  address: `0x${string}`;
  abi: any;
}

export function useContract(config: ContractConfig) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const readContract = useReadContract({
    ...config,
    functionName: '',
  });

  const executeRead = (functionName: string, args: readonly any[] = []) => {
    return useReadContract({
      ...config,
      functionName,
      args,
    });
  };

  const executeWrite = (functionName: string, args: readonly any[] = [], value?: string) => {
    return writeContract({
      ...config,
      functionName,
      args,
      value: value ? parseEther(value) : undefined,
    });
  };

  return {
    read: executeRead,
    write: executeWrite,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}
```

## Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

You can get a WalletConnect project ID from [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/).

## Demo Components

Check out the demo components in this repository:

- `src/components/WalletConnect.tsx`: A component for connecting to wallets
- `src/components/TokenBalance.tsx`: A component for interacting with ERC20 tokens
- `src/app/wallet/page.tsx`: A demo page showing how to use the components

## Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Next.js Documentation](https://nextjs.org/docs) 