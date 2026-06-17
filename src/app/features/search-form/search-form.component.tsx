'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/app/shared/components/ui'
import { cn } from '@/pkg/theme'
import { ISearchFormProps, ISearchFormValues } from './search-form.interface'

export function SearchForm({ className }: ISearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') ?? ''

  const { register, handleSubmit, reset } = useForm<ISearchFormValues>({
    defaultValues: { search: currentSearch },
  })

  // keep the visible input in sync with the URL: clears on a fresh /items (or
  // logout redirect that drops params), restores on browser Back to a searched URL
  useEffect(() => {
    reset({ search: currentSearch })
  }, [currentSearch, reset])

  const onSubmit = ({ search }: ISearchFormValues) => {
    const params = new URLSearchParams()
    const trimmed = search.trim()
    if (trimmed) params.set('search', trimmed)
    // a new search always resets to the first page
    params.set('page', '1')
    router.push(`/items?${params.toString()}`)
  }

  const onClear = () => {
    reset({ search: '' })
    router.push('/items?page=1')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex gap-2', className)}>
      <Input placeholder="Search drivers by name or team..." {...register('search')} className="max-w-sm" />
      <Button type="submit">Search</Button>
      {currentSearch && (
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      )}
    </form>
  )
}
