// experiment key enum
export enum EExperimentKey {
  ITEMS_LIST_LAYOUT = 'items-list-layout',
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
