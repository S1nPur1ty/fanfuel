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