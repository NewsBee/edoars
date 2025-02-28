// src/middleware.ts

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.clone();
    const requestedPage = url.pathname;
    // console.log("Token:", token);
    console.log("Requested Page:", requestedPage);

    // Bypass for static files and API routes
    if (requestedPage.startsWith("/api/") || /\.(.*)$/.test(requestedPage)) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from the login page
    if (token && requestedPage === "/auth/login") {
        return NextResponse.redirect(new URL(`/${token.role.toLowerCase()}/dashboard`, req.url));
    }

    // Allow access to the login page if the user is not authenticated
    if (!token && requestedPage === "/auth/login") {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const { role } = token;
    console.log("Role:", role);
    if (url.pathname.startsWith('/admin') && role !== 'Admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (url.pathname.startsWith('/mahasiswa') && role !== 'Mahasiswa') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (url.pathname.startsWith('/dosen') && role !== 'Dosen') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (url.pathname.startsWith('/kaprodi') && role !== 'Kaprodi') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|favicon.ico).*)','/admin/:path*', '/mahasiswa/:path*', '/dosen/:path*', '/kaprodi/:path*'],
};