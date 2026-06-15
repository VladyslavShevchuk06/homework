import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Route protection for /favorites — only authenticated users allowed
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /favorites route
  if (pathname === '/favorites') {
    try {
      const session = await auth.api.getSession({ headers: request.headers })

      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/favorites', '/api/favorites/:path*'],
}
