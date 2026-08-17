import { queryOptions } from '@tanstack/react-query'
import { teamsListApi } from './teams.api'
import { ETeamKey, ITeamsListParams } from '@/app/entities/models/team.model'

// teams list query key
export function teamsListQueryKey({ locale = 'en' }: ITeamsListParams = {}) {
  return [ETeamKey.LIST, locale] as const
}

// teams list query options
export function teamsListQueryOptions({ locale = 'en' }: ITeamsListParams = {}) {
  return queryOptions({
    queryKey: teamsListQueryKey({ locale }),
    queryFn: () => teamsListApi({ locale }),
  })
}
