import { type FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { routing } from '@/pkg/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/components/ui'
import { FavoriteToggle, FavoriteToggleProvider, FavoriteCountLive } from '@/app/features/favorite-toggle'
import { parseDriverMeta } from '@/app/shared/utils'
import { IItemDetailModuleProps } from './item-detail.interface'

// module
const ItemDetailModule: FC<Readonly<IItemDetailModuleProps>> = (props) => {
  const { item, locale } = props
  const { team, number, country } = parseDriverMeta(item.description)

  const backHref = locale === routing.defaultLocale ? '/items' : `/${locale}/items`

  return (
    <div className="space-y-6">
      <Link href={backHref} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
        ← Back to drivers
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {item.imageUrl && (
                <div className="relative h-96 w-full bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <FavoriteToggleProvider itemId={item.id} slug={item.slug} initialCount={item.favoritesCount}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{item.title}</CardTitle>
                  <FavoriteCountLive className="mt-1 shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {team && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Team</h3>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{team}</p>
                  </div>
                )}
                {number && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Number</h3>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">#{number}</p>
                  </div>
                )}
                {country && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Nationality</h3>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{country}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <FavoriteToggle />
          </div>
        </FavoriteToggleProvider>
      </div>
    </div>
  )
}

export default ItemDetailModule
