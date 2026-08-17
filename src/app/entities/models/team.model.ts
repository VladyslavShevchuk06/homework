import { type Locale } from 'next-intl'

// team endpoints
export enum ETeamApi {
  LIST = '/api/teams',
}

// team query keys — this entity owns its own
export enum ETeamKey {
  LIST = 'query-teams-list',
}

// team models

export interface ITeam {
  id: string
  slug: string
  name: string
}

export interface ITeamsListParams {
  locale?: Locale
}
