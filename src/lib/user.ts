import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Check if required environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required Supabase environment variables:');
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!supabaseServiceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY is not set');
}

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  is_verified: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// Function to convert a string to a UUID v5
export function stringToUuid(str: string): string {
  // Create a namespace UUID (using a random UUID as namespace)
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  
  // Create a hash of the string using the namespace
  const hash = crypto.createHash('sha1');
  hash.update(namespace + str);
  const hashBuffer = hash.digest();
  
  // Convert the hash to a UUID v5 using the newer Buffer API
  const uuid = [
    hashBuffer.subarray(0, 4).toString('hex'),
    hashBuffer.subarray(4, 6).toString('hex'),
    ((hashBuffer[6] & 0x0f) | 0x30).toString(16) + hashBuffer.subarray(7, 8).toString('hex'),
    ((hashBuffer[8] & 0x3f) | 0x80).toString(16) + hashBuffer.subarray(9, 10).toString('hex'),
    hashBuffer.subarray(10, 16).toString('hex')
  ].join('-');
  
  return uuid;
}

/**
 * Get a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Check if Supabase is properly initialized
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Cannot fetch user profile: Missing environment variables');
      return null;
    }
    
    // Convert the ID to UUID format if it's not already
    const uuid = userId.includes('-') ? userId : stringToUuid(userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uuid)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    // Check if Supabase is properly initialized
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Cannot update user profile: Missing environment variables');
      return null;
    }
    
    // Convert the ID to UUID format if it's not already
    const uuid = userId.includes('-') ? userId : stringToUuid(userId);
    
    // Remove fields that shouldn't be updated
    const { id, created_at, ...updateData } = updates;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', uuid)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}

/**
 * Check if a username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    // Check if Supabase is properly initialized
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Cannot check username availability: Missing environment variables');
      return false;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in isUsernameAvailable:', error);
    return false;
  }
}

/**
 * Get a user profile by username
 */
export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  try {
    // Check if Supabase is properly initialized
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Cannot fetch user profile by username: Missing environment variables');
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching user profile by username:', error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error in getUserProfileByUsername:', error);
    return null;
  }
} 