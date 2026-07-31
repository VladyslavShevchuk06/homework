import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/pkg/locale'
import { auth } from '@/lib/auth'
import { isFeatureOn } from '@/pkg/growthbook/growthbook.pkg'
import { EVariant } from '@/app/shared/interfaces/experiment.interface'
import {
  AB_ID_COOKIE,
  AB_ID_MAX_AGE,
  AB_VARIANT_COOKIE,
  EXPERIMENT_PATHS,
} from '@/app/shared/constants/experiment.constant'

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

  // a/b bucketing
  const experimentKey = EXPERIMENT_PATHS[path]

  if (!experimentKey) {
    return handleI18nRouting(request)
  }

  const existingId = request.cookies.get(AB_ID_COOKIE)?.value
  const abId = existingId ?? crypto.randomUUID()
  const isOn = await isFeatureOn(experimentKey, { id: abId })
  const variant = isOn ? EVariant.VARIANT_B : EVariant.CONTROL

  // hand the variant to the page as a cookie — a search param would make the rewritten url diverge
  // from the requested one, which stops client-side navigations from applying the new payload
  request.cookies.set(AB_VARIANT_COOKIE, variant)
  const response = handleI18nRouting(request)

  const cookieOptions = {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: AB_ID_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  } as const

  response.cookies.set(AB_VARIANT_COOKIE, variant, cookieOptions)

  if (!existingId) {
    response.cookies.set(AB_ID_COOKIE, abId, cookieOptions)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
