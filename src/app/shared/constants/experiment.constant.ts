import { EExperimentKey } from '@/app/shared/interfaces'

// bucketing cookie name
export const AB_ID_COOKIE = 'ab_id'

// internal variant search param
export const VARIANT_PARAM = 'variant'

// bucketing cookie lifetime — 1 year in seconds
export const AB_ID_MAX_AGE = 60 * 60 * 24 * 365

// experiment-enabled paths (locale-stripped) mapped to their experiment key
export const EXPERIMENT_PATHS: Record<string, EExperimentKey> = {
  '/items': EExperimentKey.ITEMS_LIST_LAYOUT,
}
