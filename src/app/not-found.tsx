import { NotFoundModule } from '@/app/modules/not-found'
import '@/config/styles/global.css'

// not found
export default function NotFound() {
  // return
  return (
    <html lang="en">
      <body className="bg-white text-slate-950 antialiased">
        <NotFoundModule />
      </body>
    </html>
  )
}
