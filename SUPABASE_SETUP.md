# Supabase Setup for FanFuel

This document provides instructions for setting up the Supabase database for the FanFuel application.

## Setting Up the Users Table

1. Log in to the [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Navigate to the SQL Editor
4. Create a new query and paste the following SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  bio TEXT,
  website TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own data
CREATE POLICY "Users can read their own data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow public access to public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users 
  FOR SELECT 
  USING (is_public = TRUE);

-- Allow service role to insert new users
CREATE POLICY "Service role can insert new users" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);
CREATE INDEX IF NOT EXISTS users_username_idx ON public.users (username);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON public.users (created_at);

-- Add comment to table
COMMENT ON TABLE public.users IS 'Stores user profile information';
```

5. Run the query to create the users table and set up the necessary policies

## Setting Up Environment Variables

1. In your Supabase project, go to Project Settings > API
2. Copy the following values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

3. Add these values to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** The `SUPABASE_SERVICE_ROLE_KEY` is used for server-side operations that need to bypass Row Level Security (RLS). This key has admin privileges and should never be exposed to the client. It's used in:
- NextAuth callbacks for user creation/updates
- Server-side API routes that need to perform admin operations

## How It Works

### User Authentication Flow

1. When a user signs in with Google, NextAuth handles the authentication
2. In the JWT callback, we:
   - Convert the Google user ID to a UUID format
   - Check if the user already exists in the Supabase database
   - If not, create a new user record
   - If yes, update the last_login timestamp

### Row Level Security (RLS)

The users table has the following RLS policies:
- Users can read their own data
- Users can update their own data
- Public profiles are viewable by everyone
- The service role can insert new users

### UUID Conversion

Since Google user IDs are not in UUID format, we convert them using a deterministic function that creates a UUID v5 based on the Google ID. This ensures:
- The same Google ID always generates the same UUID
- The UUID is compatible with Supabase's UUID type
- We maintain a consistent ID across the application

## Troubleshooting

If you encounter issues with user creation or updates:

1. Check that the `SUPABASE_SERVICE_ROLE_KEY` is correctly set in your environment variables
2. Verify that the RLS policies are correctly set up in Supabase
3. Check the server logs for any error messages
4. Ensure that the users table has the correct structure and constraints

## Table Structure

The `users` table has the following columns:

- `id`: UUID (Primary Key) - The unique identifier for each user
- `email`: TEXT (Unique) - The user's email address
- `name`: TEXT - The user's display name
- `image`: TEXT - URL to the user's profile image
- `provider`: TEXT - The authentication provider (e.g., "google")
- `created_at`: TIMESTAMP - When the user was created
- `updated_at`: TIMESTAMP - When the user was last updated
- `last_login`: TIMESTAMP - When the user last logged in
- `username`: TEXT (Unique) - The user's chosen username
- `bio`: TEXT - A brief description about the user
- `website`: TEXT - The user's website URL
- `location`: TEXT - The user's location
- `is_verified`: BOOLEAN - Whether the user is verified
- `is_public`: BOOLEAN - Whether the user's profile is public

## Row Level Security (RLS)

The table has the following RLS policies:

1. Users can read their own data
2. Users can update their own data
3. Public profiles are viewable by everyone
4. The service role can insert new users

## Automatic Timestamp Updates

A trigger has been set up to automatically update the `updated_at` timestamp whenever a record is updated.

## Indexes

Indexes have been created on the following columns for better query performance:

- `email`
- `username`
- `created_at`

## Integration with NextAuth

The application is configured to automatically save user data to Supabase when they sign in using NextAuth. This is handled in the `src/app/api/auth/[...nextauth]/route.ts` file.

## User Profile Management

Utility functions for managing user profiles are available in `src/lib/user.ts`. These include:

- `getUserProfile`: Get a user profile by ID
- `updateUserProfile`: Update a user profile
- `isUsernameAvailable`: Check if a username is available
- `getUserProfileByUsername`: Get a user profile by username

## Profile Edit Page

A profile edit page is available at `/profile/edit` that allows users to update their profile information. 