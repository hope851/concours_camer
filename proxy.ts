import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value;
    const { pathname } = request.nextUrl;

    // 1. Mets à jour tes routes protégées (enlève /utilisateur si le dossier n'existe plus)
    // Ajoute '/profile' si tu veux que la page de profil soit protégée
    const protectedRoutes = ['/profile', '/formupdateconcours', '/formupdateees', '/formupdatetutelle'];
    
    const authRoutes = ['/login', '/register'];

    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isProtected && !userId) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && userId) {
        // 2. CORRECTION ICI : Redirige vers le nouveau chemin du profil
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
