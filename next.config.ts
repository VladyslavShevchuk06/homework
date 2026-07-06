import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'media.formula1.com' }],
  },
  cacheComponents: true,
}

const withNextIntl = createNextIntlPlugin('./src/pkg/locale/request.ts')

export default withNextIntl(nextConfig)
