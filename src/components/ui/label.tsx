import * as React from 'react'
import { cn } from '@/pkg/theme'

interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, ILabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium leading-none text-slate-900', className)} {...props} />
))

Label.displayName = 'Label'

export { Label }
