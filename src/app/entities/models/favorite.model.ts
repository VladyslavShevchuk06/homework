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
