// experiment key enum
export enum EExperimentKey {
  ITEMS_LIST_LAYOUT = 'items-list-layout',
  FAVORITES_BACK_LINK = 'favorites-back-link',
}

// variant enum
export enum EVariant {
  CONTROL = 'control',
  VARIANT_B = 'variant-b',
}

// experiment attributes
export interface IExperimentAttributes {
  id: string
  userId?: string
}
