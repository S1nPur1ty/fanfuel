'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { TokenBalance } from '@/components/TokenBalance';
import { useAccount } from 'wagmi';

export default function WalletPage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wallet Connection Demo</h1>
      
      <div className="max-w-md mx-auto">
        <WalletConnect />
        
        {isConnected && (
          <>
            <div className="mt-8 p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Connected:</span>
                  <span className="text-green-500">Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Address:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <TokenBalance />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 