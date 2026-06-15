export { envClient } from './env.client'
export { envServer } from './env.server'

export const envConfig = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}
