import 'server-only'
import { queryOptions } from '@tanstack/react-query'
import { getTeamsList } from './teams.service'
import { teamsListQueryKey } from './teams.query'
import { ITeamsListParams } from '@/app/entities/models/team.model'

// teams list server query options
export function teamsListServerQueryOptions({ locale = 'en' }: ITeamsListParams = {}) {
  return queryOptions({
    queryKey: teamsListQueryKey({ locale }),
    queryFn: () => getTeamsList(locale),
  })
}
