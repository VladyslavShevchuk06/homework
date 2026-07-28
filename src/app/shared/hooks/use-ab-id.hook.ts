'use client'

import { useState } from 'react'
import { AB_ID_COOKIE } from '@/app/shared/constants'

// read the sticky bucketing id set by the proxy — feeds side effects only, never rendered output
export function useAbId() {
  const [abId] = useState(() => {
    if (typeof document === 'undefined') return ''
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${AB_ID_COOKIE}=`))
    return match ? decodeURIComponent(match.slice(AB_ID_COOKIE.length + 1)) : ''
  })

  return abId
}
