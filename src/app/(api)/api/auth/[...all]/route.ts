import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/app/shared/lib/auth'

// GET|POST /api/auth/[...all] — Better Auth route handler
export const { GET, POST } = toNextJsHandler(auth)
