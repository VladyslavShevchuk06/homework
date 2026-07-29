import { test as setup, expect } from '@playwright/test'
import { TEST_USER } from '../utils/users'

const authFile = 'test/e2e/.auth/user.json'

setup('authenticate', async ({ request }) => {
  await expect(async () => {
    await request.post('/api/auth/sign-up/email', {
      data: { name: TEST_USER.name, email: TEST_USER.email, password: TEST_USER.password },
      failOnStatusCode: false,
    })

    const response = await request.post('/api/auth/sign-in/email', {
      data: { email: TEST_USER.email, password: TEST_USER.password },
      failOnStatusCode: false,
    })
    // an html body means next served a page instead of the route handler — report that, not 30kb of rsc payload
    const contentType = response.headers()['content-type'] ?? 'none'
    expect(
      contentType.includes('application/json'),
      `sign-in returned ${response.status()} as ${contentType} — /api/auth route handler not registered (stale build dir?)`,
    ).toBeTruthy()

    expect(response.ok(), `sign-in ${response.status()}: ${await response.text()}`).toBeTruthy()
  }).toPass({ timeout: 30_000 })

  await request.storageState({ path: authFile })
})
