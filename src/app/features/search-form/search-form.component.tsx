'use client'

import { type FC, useRef, useState } from 'react'
import Form from 'next/form'
import { useLocale } from 'next-intl'
import { getPathname, useRouter } from '@/pkg/locale'
import { Button, Input, Select, type ISelectOption } from '@/app/shared/components/ui'
import { cn } from '@/pkg/theme'
import { ISearchFormProps } from './search-form.interface'

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

// component
export const SearchForm: FC<Readonly<ISearchFormProps>> = (props) => {
  const { search, team, className } = props
  const locale = useLocale()
  const router = useRouter()

  const currentTeam = team || 'all'
  const hasActiveFilter = search !== '' || currentTeam !== 'all'
  const action = getPathname({ href: '/items', locale })

  return (
    <Form action={action} className={cn('flex flex-wrap gap-2', className)}>
      {/* reset to first page */}
      <input type="hidden" name="page" value="1" />

      {/* reseed input from url */}
      <Input
        key={search}
        name="search"
        defaultValue={search}
        placeholder="Search drivers by name or team..."
        className="max-w-sm"
      />

      {/* reseed select from url */}
      <TeamSelect key={currentTeam} defaultTeam={currentTeam} />

      <Button type="submit">Search</Button>
      {hasActiveFilter && (
        <Button type="button" variant="outline" onClick={() => router.push('/items')}>
          Clear
        </Button>
      )}
    </Form>
  )
}

// component
const TeamSelect: FC<Readonly<{ defaultTeam: string }>> = (props) => {
  const { defaultTeam } = props
  const [team, setTeam] = useState(defaultTeam)
  const selectRef = useRef<HTMLButtonElement>(null)

  return (
    <Select
      ref={selectRef}
      name="team"
      value={team}
      onValueChange={(value) => {
        setTeam(value)
        selectRef.current?.closest('form')?.requestSubmit()
      }}
      options={TEAM_OPTIONS}
      className="w-44"
    />
  )
}
