import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/app/shared/components/ui'
import { IItem } from '@/app/entities/models'
import { parseDriverMeta } from '@/app/shared/utils'

interface IItemCardProps {
  item: IItem
}

export function ItemCard({ item }: IItemCardProps) {
  const { team, number, country } = parseDriverMeta(item.description)

  return (
    <Link href={`/items/${item.slug}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500">
        <CardContent className="p-0">
          {item.imageUrl && (
            <div className="relative h-48 w-full bg-slate-100">
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
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            {team && (
              <p className="mt-1 text-sm text-slate-600">
                <span className="font-medium">Team:</span> {team}
              </p>
            )}
            {number && (
              <p className="text-sm text-slate-600">
                <span className="font-medium">No:</span> {number}
              </p>
            )}
            {country && (
              <p className="text-sm text-slate-600">
                <span className="font-medium">Country:</span> {country}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
