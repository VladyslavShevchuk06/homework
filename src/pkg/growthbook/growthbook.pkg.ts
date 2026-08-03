import { GrowthBook, type Attributes, type FeatureApiResponse, type TrackingCallback } from '@growthbook/growthbook'
import { envClient } from '@/config/env'

// stale-while-revalidate window for the cached feature payload
const PAYLOAD_TTL_MS = 60_000

let cachedPayload: FeatureApiResponse = {}
let fetchedAt = 0
let inFlight: Promise<void> | null = null

// fetch the feature payload from the growthbook cdn — never throws, so an outage
// serves the previous payload (empty on a cold start, which resolves to control)
async function refreshPayload() {
  const host = envClient.NEXT_PUBLIC_GROWTHBOOK_API_HOST
  const key = envClient.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY
  if (!host || !key) return

  try {
    const res = await fetch(`${host}/api/features/${key}`, { cache: 'no-store' })
    if (!res.ok) return

    cachedPayload = (await res.json()) as FeatureApiResponse
  } catch {
    // cdn unreachable — keep the cached payload
  } finally {
    // mark the attempt either way, so a failing cdn is retried once per ttl instead of every request
    fetchedAt = Date.now()
  }
}

// module-cached payload; only the cold request awaits the network, stale ones refresh in the background
async function getPayload() {
  if (!fetchedAt) {
    inFlight ??= refreshPayload().finally(() => {
      inFlight = null
    })
    await inFlight
  } else if (Date.now() - fetchedAt > PAYLOAD_TTL_MS && !inFlight) {
    inFlight = refreshPayload().finally(() => {
      inFlight = null
    })
  }

  return cachedPayload
}

// evaluate a feature flag on the edge — returns false when unconfigured
export async function isFeatureOn(key: string, attributes: Attributes) {
  const payload = await getPayload()
  const growthbook = new GrowthBook({ attributes })
  growthbook.initSync({ payload })

  return growthbook.isOn(key)
}

// browser instance factory — the exposure firing happens through trackingCallback
export function createBrowserGrowthBook(options: { attributes: Attributes; trackingCallback: TrackingCallback }) {
  return new GrowthBook({
    apiHost: envClient.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: envClient.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    attributes: options.attributes,
    trackingCallback: options.trackingCallback,
  })
}
