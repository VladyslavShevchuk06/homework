import * as React from 'react'
import { cn } from '@/pkg/theme'

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-500 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
      className,
    )}
    ref={ref}
    {...props}
  />
))

Input.displayName = 'Input'

export { Input }
