import { type Locale } from 'next-intl'
import { IItem } from '@/app/entities/models'

export interface IItemDetailModuleProps {
  item: IItem
  locale: Locale
}
