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