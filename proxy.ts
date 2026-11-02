import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/session';

export function proxy(request: NextRequest) {
    const rawToken = request.cookies.get('userId')?.value;
    const userId = verifySessionToken(rawToken);
    const { pathname } = request.nextUrl;

    const protectedRoutes = [
        '/profile',
        '/formupdateconcours',
        '/formupdateees',
        '/formupdatetutelle',
        '/formconcours',
        '/formees',
        '/formnews',
        '/formpays',
        '/formprogramme',
        '/formtutelle',
        '/formville',
        '/gestionnaireconcours',
        '/gestionnaireees',
        '/gestionnairetutelle',
    ];

    const authRoutes = ['/login', '/register'];

    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isProtected && !userId) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        if (rawToken && !userId) {
            response.cookies.delete('userId');
        }
        return response;
    }

    if (isAuthRoute && userId) {
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
