import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  // build dir — overridable so the e2e dev server never shares a turbopack cache with `yarn dev`
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'media.formula1.com' }],
  },
  cacheComponents: true,
}

const withNextIntl = createNextIntlPlugin('./src/pkg/locale/request.ts')

export default withNextIntl(nextConfig)
