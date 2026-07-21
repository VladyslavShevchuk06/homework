import { type FC } from 'react'
import { ItemsListContent } from './elements/items-list-content'
import { type IItemsListParams } from '@/app/entities/models'

// module
const ItemsListModule: FC<Readonly<Required<IItemsListParams>>> = (props) => {
  const { page, search, team } = props

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">F1 2026 Drivers</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Browse the drivers of the 2026 F1 season</p>
      </div>

      <ItemsListContent page={page} search={search} team={team} />
    </div>
  )
}

export default ItemsListModule
