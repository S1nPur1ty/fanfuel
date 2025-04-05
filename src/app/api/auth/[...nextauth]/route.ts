import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { generateWeb3Wallet } from '@/lib/metal';

// Check if required environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

// Extend the Session type to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Function to convert a string to a UUID v5
function stringToUuid(str: string): string {
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

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // If this is the first sign in, save user data to Supabase
      if (account && user) {
        try {
          console.log('[NextAuth] Processing sign-in for user:', user.email);
          
          // Check if Supabase is properly initialized
          if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[NextAuth] Cannot save user to Supabase: Missing environment variables');
            return token;
          }
          
          // Convert Google ID to UUID format
          const uuid = stringToUuid(user.id);
          console.log('[NextAuth] Generated UUID for user:', uuid);
          
          // Check if user already exists
          console.log('[NextAuth] Checking if user exists in Supabase...');
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', uuid)
            .single();
          
          if (!existingUser) {
            console.log('[NextAuth] User does not exist, creating new user in Supabase...');
            // Create new user in Supabase
            const { error } = await supabase
              .from('users')
              .insert([
                {
                  id: uuid,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  provider: account.provider,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);
            
            if (error) {
              console.error('[NextAuth] Error saving user to Supabase:', error);
            } else {
              console.log('[NextAuth] User saved to Supabase successfully');
              
              // Generate web3 wallet for the new user
              console.log('[NextAuth] Initiating web3 wallet generation for new user...');
              const walletData = await generateWeb3Wallet(uuid);
              if (walletData) {
                // Update user with wallet information if needed
                // This depends on what data the Metal API returns and what you want to store
                console.log('[NextAuth] Web3 wallet generation completed successfully');
                console.log('[NextAuth] Wallet data:', JSON.stringify(walletData, null, 2));
              } else {
                console.error('[NextAuth] Failed to generate web3 wallet for user');
              }
            }
          } else {
            console.log('[NextAuth] User already exists, updating last login...');
            // Update user's last login
            const { error } = await supabase
              .from('users')
              .update({ 
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', uuid);
            
            if (error) {
              console.error('[NextAuth] Error updating user in Supabase:', error);
            } else {
              console.log('[NextAuth] User last login updated successfully');
            }
          }
        } catch (error) {
          console.error('[NextAuth] Error in Supabase user operation:', error);
        }
      }
      
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 