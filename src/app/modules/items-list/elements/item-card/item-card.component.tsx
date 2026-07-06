import Image from 'next/image'
import { Link } from '@/pkg/locale'
import { Card, CardContent, FavoriteCount } from '@/app/shared/components/ui'
import { IItem } from '@/app/entities/models'
import { parseDriverMeta } from '@/app/shared/utils'

// interface
interface IItemCardProps {
  item: IItem
}

// component
export function ItemCard({ item }: IItemCardProps) {
  const { team, number, country } = parseDriverMeta(item.description)

  // return
  return (
    <Link href={`/items/${item.slug}`}>
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
              <FavoriteCount count={item.favoritesCount} className="mt-1 shrink-0" />
            </div>
            {team && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Team:</span> {team}
              </p>
            )}
            {number && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">No:</span> {number}
              </p>
            )}
            {country && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Country:</span> {country}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
