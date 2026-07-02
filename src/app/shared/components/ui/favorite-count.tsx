import * as React from 'react'
import { cn } from '@/pkg/theme'

// interface
interface IFavoriteCountProps {
  count: number
  className?: string
}

// small popularity pill: heart icon + how many users have favorited the item
function FavoriteCount({ count, className }: IFavoriteCountProps) {
  return (
    <span
      aria-label={`Favorited ${count} time${count === 1 ? '' : 's'}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600',
        className,
      )}
    >
      <svg className="h-3.5 w-3.5 text-rose-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 17.5 8.55 16.2C4.4 12.45 1.67 9.98 1.67 6.96 1.67 4.49 3.61 2.5 6.08 2.5c1.4 0 2.74.65 3.92 1.74C11.18 3.15 12.52 2.5 13.92 2.5c2.47 0 4.41 1.99 4.41 4.46 0 3.02-2.73 5.49-6.88 9.25L10 17.5Z" />
      </svg>
      {count}
    </span>
  )
}

export { FavoriteCount }
