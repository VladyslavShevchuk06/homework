import { type FC } from 'react'
import { NotFoundModule } from '@/app/modules/not-found'
import '@/config/styles/global.css'

// not found
const NotFound: FC = () => {
  // return
  return (
    <html lang="en">
      <body className="bg-white text-slate-950 antialiased">
        <NotFoundModule />
      </body>
    </html>
  )
}

export default NotFound
