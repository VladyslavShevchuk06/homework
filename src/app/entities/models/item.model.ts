// item models

export interface IItem {
  id: string
  slug: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
}

export interface IItemsListParams {
  page?: number
  search?: string
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
