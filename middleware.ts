import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Note: We cannot access localStorage in middleware.
    // In a real app, we would check a cookie.
    // For this basic token-based auth implementation where we store token in localStorage,
    // middleware cannot fully protect the route on server-side initial load without cookies.
    // However, we can check if the user is trying to access protected routes and defer check to client.

    // BUT! The user constraint is strict.
    // Since we are using localStorage, we will handle protection via a Client Component wrapper (AuthGuard)
    // or we can't really effective use middleware for redirection unless we use cookies.

    // Changing strategy: We will use no middleware for now and rely on client-side check in a wrapper.
    // OR we can just let the middleware pass everything.

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/videos/:path*', '/connect/:path*'],
}
