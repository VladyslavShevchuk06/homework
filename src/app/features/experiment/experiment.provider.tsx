'use client'

import { type ReactNode, useEffect, useMemo } from 'react'
import { createBrowserGrowthBook, GrowthBookProvider } from '@/pkg/growthbook'
import { mixpanelClient } from '@/pkg/mixpanel'
import { authClient } from '@/pkg/auth'
import { useAbId } from '@/app/shared/hooks/use-ab-id.hook'

// interface
interface IProps {
  children: ReactNode
}

// experiment provider
export function ExperimentProvider(props: Readonly<IProps>) {
  const { children } = props
  const abId = useAbId()
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  // created once — attributes are applied through the effect below
  const growthbook = useMemo(
    () =>
      createBrowserGrowthBook({
        attributes: {},
        trackingCallback: (experiment, result) =>
          mixpanelClient.track('$experiment_started', {
            'Experiment name': experiment.key,
            'Variant name': result.key,
          }),
      }),
    [],
  )

  // load feature definitions from the cdn
  useEffect(() => {
    void growthbook.init({ streaming: false })
  }, [growthbook])

  // keep bucketing consistent with the edge (same anon id) and merge the auth user when present
  useEffect(() => {
    if (!abId) return
    void growthbook.setAttributes({ id: abId, userId })
  }, [growthbook, abId, userId])

  return <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
}
