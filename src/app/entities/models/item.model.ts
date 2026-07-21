import { type Locale } from 'next-intl'

// item models

export interface IItem {
  id: string
  slug: string
  title: string
  team: string
  number: string
  country: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  favoritesCount: number
}

export interface IItemsListParams {
  page?: number
  search?: string
  team?: string
  locale?: Locale
}

export interface IItemsListMeta {
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface IItemsListResponse {
  data: IItem[]
  meta: IItemsListMeta
}
