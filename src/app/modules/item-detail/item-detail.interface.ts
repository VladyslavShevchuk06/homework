import { type Locale } from 'next-intl'
import { IItem } from '@/app/entities/models/item.model'

export interface IItemDetailModuleProps {
  item: IItem
  locale: Locale
}
