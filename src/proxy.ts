import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/pkg/locale'
import { auth } from '@/lib/auth'

const handleI18nRouting = createMiddleware(routing)

function stripLocale(pathname: string) {
  const segments = pathname.split('/')
  const candidate = segments[1]

  if (routing.locales.includes(candidate as (typeof routing.locales)[number])) {
    const rest = '/' + segments.slice(2).join('/')
    return { locale: candidate, path: rest === '/' ? '/' : rest.replace(/\/$/, '') }
  }

  return { locale: routing.defaultLocale, path: pathname }
}

function localizedUrl(path: string, locale: string, request: NextRequest) {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return new URL(`${prefix}${path}`, request.url)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, path } = stripLocale(pathname)

  const isFavorites = path === '/favorites'
  const isGuestOnly = path === '/login' || path === '/register'

  if (isFavorites || isGuestOnly) {
    let session = null
    try {
      session = await auth.api.getSession({ headers: request.headers })
    } catch {
      session = null
    }

    if (isFavorites && !session) {
      return NextResponse.redirect(localizedUrl('/login', locale, request))
    }

    if (isGuestOnly && session) {
      return NextResponse.redirect(localizedUrl('/items', locale, request))
    }
  }

  return handleI18nRouting(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
