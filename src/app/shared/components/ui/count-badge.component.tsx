import * as React from 'react'
import { cn } from '@/pkg/theme'

interface ICountBadgeProps {
  count: number
  icon: React.ReactNode
  label: string
  className?: string
}

const CountBadge: React.FC<Readonly<ICountBadgeProps>> = ({ count, icon, label, className }) => {
  return (
    <span
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        className,
      )}
    >
      {icon}
      {count}
    </span>
  )
}

export { CountBadge }
