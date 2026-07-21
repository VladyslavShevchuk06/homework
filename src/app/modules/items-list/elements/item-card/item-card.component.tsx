'use client'

import { type FC } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/pkg/locale'
import { Card, CardContent, CountBadge } from '@/app/shared/components/ui'
import { IItem } from '@/app/entities/models'

// interface
interface IItemCardProps {
  item: IItem
}

// component
export const ItemCard: FC<Readonly<IItemCardProps>> = (props) => {
  const { item } = props
  const t = useTranslations('DriverCard')
  const { team, number, country } = item

  // return
  return (
    <Link href={`/items/${item.slug}`} data-testid="driver-card">
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500">
        <CardContent className="p-0">
          {item.imageUrl && (
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <CountBadge
                count={item.favoritesCount}
                label={t('favoritedAria', { count: item.favoritesCount })}
                icon={
                  <svg className="h-3.5 w-3.5 text-rose-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 17.5 8.55 16.2C4.4 12.45 1.67 9.98 1.67 6.96 1.67 4.49 3.61 2.5 6.08 2.5c1.4 0 2.74.65 3.92 1.74C11.18 3.15 12.52 2.5 13.92 2.5c2.47 0 4.41 1.99 4.41 4.46 0 3.02-2.73 5.49-6.88 9.25L10 17.5Z" />
                  </svg>
                }
                className="mt-1 shrink-0"
              />
            </div>
            {team && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">{t('team')}</span> {team}
              </p>
            )}
            {number && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">{t('number')}</span> {number}
              </p>
            )}
            {country && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">{t('country')}</span> {country}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
