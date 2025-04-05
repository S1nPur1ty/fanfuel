import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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
          // Check if Supabase is properly initialized
          if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Cannot save user to Supabase: Missing environment variables');
            return token;
          }
          
          // Convert Google ID to UUID format
          const uuid = stringToUuid(user.id);
          
          // Check if user already exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', uuid)
            .single();
          
          if (!existingUser) {
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
              console.error('Error saving user to Supabase:', error);
            } else {
              console.log('User saved to Supabase successfully');
            }
          } else {
            // Update user's last login
            const { error } = await supabase
              .from('users')
              .update({ 
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', uuid);
            
            if (error) {
              console.error('Error updating user in Supabase:', error);
            }
          }
        } catch (error) {
          console.error('Error in Supabase user operation:', error);
        }
      }
      
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 