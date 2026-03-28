import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const username = token?.githubUsername as string | undefined;
    
    // Convert allowed usernames list to array of lowercase strings
    const rawAllowed = process.env.ADMIN_GITHUB_USERNAMES || '';
    const allowedUsers = rawAllowed.split(',').map(u => u.trim().toLowerCase());
    
    // Protection logic for Keystatic and Content API
    const isKeystaticPath = req.nextUrl.pathname.startsWith('/keystatic');
    const isApiContentPath = req.nextUrl.pathname.startsWith('/api/content');

    if (isKeystaticPath || isApiContentPath) {
      console.log(`[MIDDLEWARE] Accessing protected path: ${req.nextUrl.pathname} (User: ${username})`);
      
      const isAuthorized = username && allowedUsers.includes(username.toLowerCase());
      
      if (!isAuthorized) {
        console.warn(`[MIDDLEWARE] Unauthorized access attempt to ${req.nextUrl.pathname} by ${username || 'Anonymous'}`);
        return new NextResponse('Forbidden: Your GitHub account is not authorized to access this admin panel.', {
          status: 403,
        });
      }
    }
  },
  {
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/keystatic/:path*',
    '/api/keystatic/:path*',
    '/api/content/:path*'
  ],
};
