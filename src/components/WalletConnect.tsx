'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

export function WalletConnect() {
  const { address, isConnected, isConnecting, connectWallet, disconnect, error } = useWallet();
  const [selectedConnector, setSelectedConnector] = useState<'injected' | 'metaMask' | 'walletConnect'>('metaMask');

  const handleConnect = async () => {
    try {
      await connectWallet(selectedConnector);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
      
      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Connected Address:</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          <button
            onClick={() => disconnect()}
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Wallet</label>
            <select
              value={selectedConnector}
              onChange={(e) => setSelectedConnector(e.target.value as 'injected' | 'metaMask' | 'walletConnect')}
              className="w-full p-2 border rounded"
            >
              <option value="injected">Browser Wallet</option>
              <option value="metaMask">MetaMask</option>
              <option value="walletConnect">WalletConnect</option>
            </select>
          </div>
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
              {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 