import { EExperimentKey } from '@/app/shared/interfaces/experiment.interface'

// bucketing cookie name
export const AB_ID_COOKIE = 'ab_id'

// resolved variant cookie name — one slot per experiment, so a prefetch of another
// experiment's route cannot overwrite the variant this page is reading
export function abVariantCookie(key: EExperimentKey) {
  return `ab_variant_${key}`
}

// bucketing cookie lifetime — 1 year in seconds
export const AB_ID_MAX_AGE = 60 * 60 * 24 * 365

// experiment-enabled paths (locale-stripped) mapped to their experiment key
export const EXPERIMENT_PATHS: Record<string, EExperimentKey> = {
  '/items': EExperimentKey.ITEMS_LIST_LAYOUT,
}

// experiment key for a locale-stripped path
export function resolveExperimentKey(path: string): EExperimentKey | undefined {
  // detail routes carry a slug — matched by prefix, not by exact path
  if (path.startsWith('/items/')) return EExperimentKey.FAVORITES_BACK_LINK

  return EXPERIMENT_PATHS[path]
}
