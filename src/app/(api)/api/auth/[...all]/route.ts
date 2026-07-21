import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

// GET|POST /api/auth/[...all]
export const { GET, POST } = toNextJsHandler(auth)
