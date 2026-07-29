'use client'

import mixpanel from 'mixpanel-browser'
import { envClient } from '@/config/env'

let initialized = false

// lazy init — returns false when no token is configured (tracking disabled)
function ensureInit() {
  if (initialized) return true
  const token = envClient.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token) return false
  mixpanel.init(token, { persistence: 'localStorage', track_pageview: false, api_host: 'https://api-eu.mixpanel.com' })
  initialized = true
  return true
}

// mixpanel client
export const mixpanelClient = {
  // track event — no-op on the server or when disabled
  track(event: string, properties?: Record<string, unknown>) {
    if (typeof window === 'undefined') return
    if (!ensureInit()) return
    mixpanel.track(event, properties)
  },
}
