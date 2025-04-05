'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useContract } from '@/hooks/useContract';

// Sample ERC20 ABI (minimal for balanceOf and transfer)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

export function TokenBalance() {
  const { address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>('0x6B175474E89094C44Da98b954EedeAC495271d0F'); // DAI token on Ethereum mainnet
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const contract = useContract({
    address: tokenAddress,
    abi: ERC20_ABI,
  });

  const { data: balance, isLoading: isLoadingBalance } = contract.read('balanceOf', [address as `0x${string}`]);

  const handleTransfer = async () => {
    if (!address || !recipientAddress || !amount) return;
    
    try {
      await contract.write('transfer', [recipientAddress as `0x${string}`, BigInt(parseFloat(amount) * 10 ** 18)]);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Token Balance</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Token Address</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        
        {isLoadingBalance ? (
          <p>Loading balance...</p>
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-medium">Your Balance:</span>
            <span className="font-mono">
              {balance ? (Number(balance) / 10 ** 18).toFixed(4) : '0'} tokens
            </span>
          </div>
        )}
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Transfer Tokens</h3>
          
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0x..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0.0"
                step="0.0001"
              />
            </div>
            
            <button
              onClick={handleTransfer}
              disabled={!address || !recipientAddress || !amount || contract.isPending || contract.isConfirming}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              {contract.isPending ? 'Confirming...' : contract.isConfirming ? 'Processing...' : 'Transfer'}
            </button>
            
            {contract.error && (
              <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                {contract.error.message}
              </div>
            )}
            
            {contract.isConfirmed && (
              <div className="p-2 bg-green-100 text-green-700 rounded text-sm">
                Transaction confirmed! Hash: {contract.hash?.slice(0, 10)}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 