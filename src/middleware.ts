import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { PROTECTED_ROUTES, ADMIN_ROUTES, GUEST_ONLY_ROUTES } from '@/constants/routes'

const ACCESS_TOKEN_COOKIE = 'access_token'

interface JwtPayload {
    exp?: number
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string
}

function getRoleFromToken(token: string): string | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token)
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null
    } catch {
        return null
    }
}

function isTokenExpired(token: string): boolean {
    try {
        const { exp } = jwtDecode<JwtPayload>(token)
        return typeof exp === 'number' && exp * 1000 < Date.now()
    } catch {
        return true
    }
}

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

    const isAuthenticated = !!token && !isTokenExpired(token)

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
    const isGuestOnly = GUEST_ONLY_ROUTES.some((route) => pathname === route)

    if ((isProtected || isAdminRoute) && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (isGuestOnly && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (isAdminRoute && isAuthenticated) {
        const role = getRoleFromToken(token!)
        if (role !== 'Admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}
