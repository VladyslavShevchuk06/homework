'use client'

import { useContext } from 'react'
import { FavoriteToggleContext } from './favorite-toggle.provider'

export function useFavoriteToggle() {
  const context = useContext(FavoriteToggleContext)

  if (!context) {
    throw new Error('useFavoriteToggle must be used within FavoriteToggleProvider')
  }

  return context
}
