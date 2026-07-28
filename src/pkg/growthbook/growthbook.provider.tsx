'use client'

import { type ReactNode } from 'react'
import { type GrowthBook, GrowthBookProvider as GBProvider, useFeatureIsOn } from '@growthbook/growthbook-react'

// interface
interface IProps {
  growthbook: GrowthBook
  children: ReactNode
}

// provider
export function GrowthBookProvider(props: Readonly<IProps>) {
  const { growthbook, children } = props

  return <GBProvider growthbook={growthbook}>{children}</GBProvider>
}

// evaluate the flag once to trigger a deduped exposure event
export function useExperimentExposure(key: string) {
  useFeatureIsOn(key)
}
