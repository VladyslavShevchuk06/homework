import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'media.formula1.com' }],
  },
  // Next.js 16 stabilized the old experimental `dynamicIO` flag as the
  // top-level `cacheComponents` option — this is what enables the `'use cache'`
  // directive. (`experimental: { dynamicIO: true }` no longer exists in 16.x
  // and fails type-checking.)
  cacheComponents: true,
}

export default nextConfig
