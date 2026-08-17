'use client'

import { type FC, useRef, useState } from 'react'
import Form from 'next/form'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { getPathname, useRouter } from '@/pkg/locale'
import { teamsListQueryOptions } from '@/app/entities/api/teams'
import { Button, Input, Select, type ISelectOption } from '@/app/shared/components/ui'
import { cn } from '@/pkg/theme'
import { ISearchFormProps } from './search-form.interface'

// component
export const SearchForm: FC<Readonly<ISearchFormProps>> = (props) => {
  const { search, team, className } = props
  const locale = useLocale()
  const t = useTranslations('SearchForm')
  const router = useRouter()
  const { data: teams } = useQuery(teamsListQueryOptions({ locale }))

  const currentTeam = team || 'all'
  const hasActiveFilter = search !== '' || currentTeam !== 'all'
  const action = getPathname({ href: '/items', locale })

  const teamOptions: ISelectOption[] = [
    { label: t('allTeams'), value: 'all' },
    ...(teams ?? []).map((option) => ({ label: option.name, value: option.slug })),
  ]

  return (
    <Form action={action} className={cn('flex flex-wrap gap-2', className)}>
      {/* reset to first page */}
      <input type="hidden" name="page" value="1" />

      {/* reseed input from url */}
      <Input key={search} name="search" defaultValue={search} placeholder={t('placeholder')} className="max-w-sm" />

      {/* reseed select from url */}
      <TeamSelect key={currentTeam} defaultTeam={currentTeam} options={teamOptions} />

      <Button type="submit">{t('search')}</Button>
      {hasActiveFilter && (
        <Button type="button" variant="outline" onClick={() => router.push('/items')}>
          {t('clear')}
        </Button>
      )}
    </Form>
  )
}

// component
const TeamSelect: FC<Readonly<{ defaultTeam: string; options: ISelectOption[] }>> = (props) => {
  const { defaultTeam, options } = props
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
      options={options}
      className="w-44"
    />
  )
}
