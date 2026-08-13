import 'server-only'
import { asc } from 'drizzle-orm'
import { type Locale } from 'next-intl'
import { db } from '@/db'
import { teams } from '@/db/schema'
import { ITeam } from '@/app/entities/models/team.model'

// get teams list
export async function getTeamsList(locale: Locale = 'en'): Promise<ITeam[]> {
  const name = locale === 'uk' ? teams.nameUk : teams.nameEn

  return db.select({ id: teams.id, slug: teams.slug, name }).from(teams).orderBy(asc(name))
}
