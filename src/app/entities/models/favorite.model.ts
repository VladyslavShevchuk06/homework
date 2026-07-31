// favorite endpoints
export enum EFavoriteApi {
  LIST = '/api/favorites',
}

// favorite query keys — this entity owns its own
export enum EFavoriteKey {
  LIST = 'query-favorites-list',
}

// favorite models
export interface IFavoriteWithItem {
  id: string
  itemId: string
  slug: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  favoritesCount: number
}
