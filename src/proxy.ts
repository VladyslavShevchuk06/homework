import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/pkg/locale'
import { auth } from '@/lib/auth'
import { isFeatureOn } from '@/pkg/growthbook/growthbook.pkg'
import { EVariant } from '@/app/shared/interfaces/experiment.interface'
import {
  AB_ID_COOKIE,
  AB_ID_MAX_AGE,
  EXPERIMENT_PATHS,
  VARIANT_PARAM,
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

  // inject the variant so next-intl carries it onto its internal rewrite — the browser url stays clean
  request.nextUrl.searchParams.set(VARIANT_PARAM, variant)
  const response = handleI18nRouting(request)

  // prefixed-locale paths (e.g. /uk/items) resolve as a passthrough that would drop the injected param;
  // upgrade that passthrough to a rewrite of the same url so the variant reaches the page for every locale
  if (!response.headers.has('location') && !response.headers.has('x-middleware-rewrite')) {
    response.headers.set('x-middleware-rewrite', request.nextUrl.toString())
    response.headers.delete('x-middleware-next')
  }

  if (!existingId) {
    response.cookies.set(AB_ID_COOKIE, abId, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: AB_ID_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
