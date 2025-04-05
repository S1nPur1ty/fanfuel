'use client';

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/hooks/useWallet';

export function WalletButton() {
  const { address, isConnected, isConnecting, connectWallet, disconnect, error } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<'injected' | 'metaMask' | 'walletConnect'>('metaMask');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet(selectedConnector);
      setShowDropdown(false);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isConnected ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-mono text-sm">
              {address?.slice(0, 4)}...{address?.slice(-4)}
            </span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">Connected Wallet</p>
                <p className="font-mono text-sm truncate">{address}</p>
              </div>
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <span>Connect Wallet</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
              <h3 className="text-sm font-medium mb-3">Connect your wallet</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Select Wallet</label>
                  <select
                    value={selectedConnector}
                    onChange={(e) => setSelectedConnector(e.target.value as 'injected' | 'metaMask' | 'walletConnect')}
                    className="w-full p-2 text-sm border rounded"
                  >
                    <option value="injected">Browser Wallet</option>
                    <option value="metaMask">MetaMask</option>
                    <option value="walletConnect">WalletConnect</option>
                  </select>
                </div>
                
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full py-2 px-4 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
                
                {error && (
                  <div className="p-2 bg-red-100 text-red-700 rounded text-xs">
                    {error.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 