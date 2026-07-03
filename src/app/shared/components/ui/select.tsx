'use client'

import * as React from 'react'
import { cn } from '@/pkg/theme'

// interface
export interface ISelectOption {
  label: string
  value: string
}

interface ISelectProps {
  value: string
  onValueChange: (value: string) => void
  options: ISelectOption[]
  placeholder?: string
  className?: string
}

// lightweight, controlled dropdown built in the project's custom-UI style
// (no Radix). Exposes a value + onValueChange contract so it binds cleanly to
// react-hook-form's Controller.
const Select = React.forwardRef<HTMLButtonElement, ISelectProps>(
  ({ value, onValueChange, options, placeholder = 'Select...', className }, ref) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const selected = options.find((option) => option.value === value)

    // close on outside click / Escape so the panel behaves like a real dropdown
    React.useEffect(() => {
      if (!open) return

      const onPointerDown = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false)
      }

      document.addEventListener('mousedown', onPointerDown)
      document.addEventListener('keydown', onKeyDown)
      return () => {
        document.removeEventListener('mousedown', onPointerDown)
        document.removeEventListener('keydown', onKeyDown)
      }
    }, [open])

    const handleSelect = (next: string) => {
      onValueChange(next)
      setOpen(false)
    }

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <button
          ref={ref}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-base focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-500',
            !selected && 'text-slate-500 dark:text-slate-400',
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <svg
            className={cn(
              'h-4 w-4 shrink-0 text-slate-500 transition-transform dark:text-slate-400',
              open && 'rotate-180',
            )}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded border border-slate-200 bg-white py-1 shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-left text-base hover:bg-slate-50 dark:hover:bg-slate-700',
                    option.value === value && 'bg-slate-100 font-medium dark:bg-slate-700',
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'

export { Select }
