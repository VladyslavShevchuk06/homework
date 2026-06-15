// item models

export interface IItem {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
}

export interface IItemsListParams {
  limit?: number
  offset?: number
}

export interface IItemsListResponse {
  items: IItem[]
  total: number
}
