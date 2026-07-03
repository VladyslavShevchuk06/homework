'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Button } from './button'

const emptySubscribe = () => () => {}

// component
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  if (!mounted) {
    return <span className="inline-block h-8 w-9" aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? '☀️' : '🌙'}
    </Button>
  )
}
