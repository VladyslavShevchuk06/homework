import { test as base } from '@playwright/test'
import { makeUser, type ITestUser } from '../utils/users'

export interface IAuthApi {
  signUp(user: ITestUser): Promise<number>
  signIn(user: ITestUser): Promise<number>
  getFavoritesStatus(): Promise<number>
}

export const test = base.extend<{ authApi: IAuthApi }, { newUser: () => ITestUser }>({
  newUser: [
    async ({}, provide, workerInfo) => {
      let index = 0

      await provide(() => {
        index += 1
        return makeUser(`w${workerInfo.workerIndex}-${index}`)
      })
    },
    { scope: 'worker' },
  ],

  authApi: async ({ request }, provide) => {
    await provide({
      async signUp(user) {
        const response = await request.post('/api/auth/sign-up/email', {
          data: { name: user.name, email: user.email, password: user.password },
          failOnStatusCode: false,
        })
        return response.status()
      },

      async signIn(user) {
        const response = await request.post('/api/auth/sign-in/email', {
          data: { email: user.email, password: user.password },
          failOnStatusCode: false,
        })
        return response.status()
      },

      async getFavoritesStatus() {
        const response = await request.get('/api/favorites', { failOnStatusCode: false })
        return response.status()
      },
    })
  },
})
