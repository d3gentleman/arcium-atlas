import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  const allowedUsernames = (process.env.ADMIN_GITHUB_USERNAMES || '').split(',').map(s => s.trim());
  const username = (session.user as { githubUsername?: string }).githubUsername;

  if (!username) return false;

  return allowedUsernames.includes(username);
}
