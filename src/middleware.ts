// src/middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.clone();
    const requestedPage = url.pathname;
    console.log("Token:", token);
    console.log("Requested Page:", requestedPage);


    // Bypass for static files and API routes
    if (
        requestedPage.startsWith('/api/') ||
        /\.(.*)$/.test(requestedPage)
    ) {
        return NextResponse.next();
    }

    // Redirect to home if already authenticated and trying to access login page
    if (token && requestedPage === '/auth/login') { // Ensure this matches your actual login path
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Redirect to login if not authenticated and trying to access protected pages
    const protectedPages = ['/dashboard', '/pengajuan', '/penawaran', '/pengumuman',];
    if (!token && protectedPages.some(page => requestedPage.startsWith(page))) {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|favicon.ico).*)'], // Matches all paths except for those in the exclusion list
};
