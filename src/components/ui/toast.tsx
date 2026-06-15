import * as React from 'react'
import { cn } from '@/pkg/theme'

interface IToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error'
}

const Toast = React.forwardRef<HTMLDivElement, IToastProps>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-slate-900 text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  }

  return (
    <div ref={ref} className={cn('rounded-lg px-4 py-3 shadow-lg', variantStyles[variant], className)} {...props} />
  )
})

Toast.displayName = 'Toast'

export { Toast }
