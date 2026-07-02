import { type NextPage } from 'next'
import { redirect } from 'next/navigation'

// page
const Home: NextPage = () => {
  redirect('/items')
}

export default Home
