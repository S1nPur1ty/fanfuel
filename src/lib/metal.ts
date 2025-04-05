/**
 * Utility functions for interacting with the Metal API
 */

import axios from 'axios';

/**
 * Generate a web3 wallet for a user
 * @param userId The UUID of the user
 * @returns The response from the Metal API
 */
export async function generateWeb3Wallet(userId: string): Promise<any | null> {
  const apiKey = process.env.METAL_API_KEY;
  
  if (!apiKey) {
    console.error('[Metal API] Missing METAL_API_KEY environment variable');
    return null;
  }
  
  console.log(`[Metal API] Starting web3 wallet generation for user: ${userId}`);
  
  try {
    const startTime = Date.now();
    console.log('[Metal API] Making request to Metal API...');
    
    const response = await axios.put(
      `https://api.metal.build/holder/${userId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      }
    );
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`[Metal API] Request completed in ${responseTime}ms`);
    console.log('[Metal API] Response status:', response.status);
    console.log('[Metal API] Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Metal API] Axios error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error('[Metal API] Error generating web3 wallet:', error);
    }
    return null;
  }
}

export async function getHolderTokens(userId: string): Promise<any | null> {
  try {
    const response = await axios.get(
      `https://api.metal.build/holder/${userId}?publicKey=${process.env.METAL_PUBLIC_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '12304f08-d61b-56a9-89c1-089a3c8d02a0'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('[Metal API] Error getting holder tokens:', error);
    return null;
  }
}