import { type FC } from 'react'
import { fontPrimary } from '@/config/fonts'
import { cn } from '@/pkg/theme'
import { NotFoundModule } from '@/app/modules/not-found'
import '@/config/styles/global.css'

const NotFound: FC = () => {
  return (
    <html lang="en">
      <body className={cn('bg-white text-slate-950 antialiased', fontPrimary.variable, fontPrimary.className)}>
        <NotFoundModule />
      </body>
    </html>
  )
}

export default NotFound
