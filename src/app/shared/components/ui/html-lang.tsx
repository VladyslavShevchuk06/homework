'use client'

import { useEffect } from 'react'

interface IProps {
  locale: string
}

export function HtmlLang({ locale }: IProps) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
