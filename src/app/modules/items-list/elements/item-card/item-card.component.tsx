import Link from 'next/link'
import { Card, CardContent } from '@/components/ui'
import { IItem } from '@/entities/models'

interface IItemCardProps {
  item: IItem
}

export function ItemCard({ item }: IItemCardProps) {
  const [team, number, country] = item.description
    ? item.description.split(' | ').map((s) => s.split(': ')[1])
    : ['', '', '']

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500">
        <CardContent className="p-0">
          {item.imageUrl && (
            <div className="relative h-48 w-full bg-slate-100">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
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
