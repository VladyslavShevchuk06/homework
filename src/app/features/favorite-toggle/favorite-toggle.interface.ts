import { ReactNode } from 'react'

// interface
export interface IFavoriteToggleProviderProps {
  itemId: string
  slug: string
  initialCount: number
  children: ReactNode
}

export interface IFavoriteToggleContextValue {
  canRender: boolean
  favorited: boolean
  count: number
  isMutating: boolean
  toggle: () => void
}

export interface IFavoriteCountLiveProps {
  className?: string
}
