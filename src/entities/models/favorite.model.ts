// favorite models

import { IItem } from './item.model'

export interface IFavorite {
  id: string
  itemId: string
  userId: string
  createdAt: Date
}

export interface IFavoriteWithItem {
  id: string
  itemId: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
}

export interface IToggleFavoriteBody {
  itemId: string
}
