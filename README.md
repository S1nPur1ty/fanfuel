# FanFuel

FanFuel is a web application that allows users to generate and share AI-generated images.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account
- A Google Cloud account (for Google OAuth)
- A Metal API key (for web3 wallet generation)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Metal API
METAL_API_KEY=your_metal_api_key
```

You can run the environment check script to verify your setup:

```bash
node scripts/check-env.js
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up the Supabase database:

```bash
# Follow the instructions in SUPABASE_SETUP.md
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- User authentication with Google OAuth
- AI image generation
- Image sharing and social features
- User profiles
- Web3 wallet generation for new users

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: React components
- `src/lib`: Utility functions and shared code
- `supabase`: SQL scripts for database setup

## License

This project is licensed under the MIT License - see the LICENSE file for details.
