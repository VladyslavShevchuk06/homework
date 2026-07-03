import * as React from 'react'
import { cn } from '@/pkg/theme'

// component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-500 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)

Input.displayName = 'Input'

export { Input }
