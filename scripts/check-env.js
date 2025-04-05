#!/usr/bin/env node

/**
 * This script checks if all required environment variables are set.
 * Run it with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

// Define required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

// Try to load .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse .env.local file
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      envVars[key.trim()] = value.trim();
    }
  });
  
  console.log('✅ Found .env.local file');
} else {
  console.log('❌ .env.local file not found');
}

// Check if each required variable is set
let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!envVars[varName]) {
    missingVars.push(varName);
  }
});

// Print results
console.log('\nEnvironment Variables Check:');
console.log('----------------------------');

if (missingVars.length === 0) {
  console.log('✅ All required environment variables are set');
} else {
  console.log('❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\nTo fix this:');
  console.log('1. Go to your Supabase project settings > API');
  console.log('2. Copy the required values');
  console.log('3. Add them to your .env.local file:');
  console.log('\nNEXT_PUBLIC_SUPABASE_URL=your_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id');
  console.log('NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret');
  console.log('NEXTAUTH_SECRET=your_nextauth_secret');
  console.log('NEXTAUTH_URL=http://localhost:3000');
}

// Print current values (with sensitive parts masked)
console.log('\nCurrent Environment Variables:');
console.log('----------------------------');
requiredEnvVars.forEach(varName => {
  const value = envVars[varName] || 'Not set';
  const maskedValue = value === 'Not set' ? value : maskValue(value);
  console.log(`${varName}: ${maskedValue}`);
});

// Helper function to mask sensitive values
function maskValue(value) {
  if (value.length <= 8) return '********';
  return value.substring(0, 4) + '********' + value.substring(value.length - 4);
} 