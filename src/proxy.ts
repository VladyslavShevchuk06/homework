import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Route protection:
//  - /favorites is auth-only (guests → /login)
//  - /login, /register are guest-only (authenticated users → /items)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isFavorites = pathname === '/favorites'
  const isGuestOnly = pathname === '/login' || pathname === '/register'

  // only the page routes need a session lookup; /api/favorites/* falls through
  // to the route handler, which enforces auth itself
  if (isFavorites || isGuestOnly) {
    let session = null
    try {
      session = await auth.api.getSession({ headers: request.headers })
    } catch {
      session = null
    }

    if (isFavorites && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isGuestOnly && session) {
      return NextResponse.redirect(new URL('/items', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/favorites', '/api/favorites/:path*', '/login', '/register'],
}
