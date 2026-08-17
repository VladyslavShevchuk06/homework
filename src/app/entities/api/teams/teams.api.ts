import { ETeamApi, ITeam, ITeamsListParams } from '@/app/entities/models/team.model'

// teams list fetch
export async function teamsListApi({ locale = 'en' }: ITeamsListParams = {}): Promise<ITeam[]> {
  const params = new URLSearchParams({ locale })

  const response = await fetch(`${ETeamApi.LIST}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch teams')
  }

  return response.json()
}
