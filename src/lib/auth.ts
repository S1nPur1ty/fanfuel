import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  const session = await getServerSession(options);
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
} 