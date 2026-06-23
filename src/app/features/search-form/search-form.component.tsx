'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, Select, type ISelectOption } from '@/app/shared/components/ui'
import { cn } from '@/pkg/theme'
import { ISearchFormProps, ISearchFormValues } from './search-form.interface'

// 2026 grid; `value` is substring-matched against "Team: <value>" in the
// description, so "Red Bull" matches "Red Bull Racing". "all" means no filter.
const TEAM_OPTIONS: ISelectOption[] = [
  { label: 'All Teams', value: 'all' },
  { label: 'Red Bull', value: 'Red Bull' },
  { label: 'Ferrari', value: 'Ferrari' },
  { label: 'McLaren', value: 'McLaren' },
  { label: 'Mercedes', value: 'Mercedes' },
  { label: 'Aston Martin', value: 'Aston Martin' },
  { label: 'Alpine', value: 'Alpine' },
  { label: 'Haas', value: 'Haas' },
  { label: 'Audi', value: 'Audi' },
  { label: 'Racing Bulls', value: 'Racing Bulls' },
  { label: 'Cadillac', value: 'Cadillac' },
  { label: 'Williams', value: 'Williams' },
]

export function SearchForm({ className }: ISearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') ?? ''
  const currentTeam = searchParams.get('team') ?? 'all'

  const { register, handleSubmit, reset, control, getValues } = useForm<ISearchFormValues>({
    defaultValues: { search: currentSearch, team: currentTeam },
  })

  // keep the visible controls in sync with the URL: clears on a fresh /items
  // (or the "Drivers" nav link that drops params), restores on browser Back to
  // a filtered URL. Listens to BOTH search and team.
  useEffect(() => {
    reset({ search: currentSearch, team: currentTeam })
  }, [currentSearch, currentTeam, reset])

  // single source of truth for navigation: a search and/or team filter always
  // resets pagination to the first page.
  const pushParams = ({ search, team }: ISearchFormValues) => {
    const params = new URLSearchParams()
    const trimmed = search.trim()
    if (trimmed) params.set('search', trimmed)
    if (team && team !== 'all') params.set('team', team)
    params.set('page', '1')
    router.push(`/items?${params.toString()}`)
  }

  const onSubmit = (values: ISearchFormValues) => pushParams(values)

  // selecting a team navigates immediately, preserving the current search text
  const onTeamChange = (team: string) => pushParams({ search: getValues('search'), team })

  const onClear = () => {
    reset({ search: '', team: 'all' })
    router.push('/items?page=1')
  }

  const hasActiveFilter = currentSearch !== '' || currentTeam !== 'all'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-wrap gap-2', className)}>
      <Input placeholder="Search drivers by name or team..." {...register('search')} className="max-w-sm" />
      <Controller
        control={control}
        name="team"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value)
              onTeamChange(value)
            }}
            options={TEAM_OPTIONS}
            className="w-44"
          />
        )}
      />
      <Button type="submit">Search</Button>
      {hasActiveFilter && (
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      )}
    </form>
  )
}
