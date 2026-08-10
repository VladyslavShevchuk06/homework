'use client'

import { useState } from 'react'
import { abVariantCookie } from '@/app/shared/constants/experiment.constant'
import { EExperimentKey, EVariant } from '@/app/shared/interfaces/experiment.interface'

// read the variant resolved by the proxy — control until the cookie says otherwise
export function useAbVariant(key: EExperimentKey) {
  const [variant] = useState<EVariant>(() => {
    if (typeof document === 'undefined') return EVariant.CONTROL

    const name = abVariantCookie(key)
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
    const value = match ? decodeURIComponent(match.slice(name.length + 1)) : ''

    return value === EVariant.VARIANT_B ? EVariant.VARIANT_B : EVariant.CONTROL
  })

  return variant
}
