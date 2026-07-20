import { test, expect, GUEST_STATE } from '../fixtures/test'

test.describe('Route gating (guest)', () => {
  test.use({ storageState: GUEST_STATE })

  test('redirects guests away from favorites', async ({ page }) => {
    await page.goto('/favorites')

    await expect(page).toHaveURL(/\/login/)
  })

  test('returns 401 from the favorites API without a session', async ({ authApi }) => {
    expect(await authApi.getFavoritesStatus()).toBe(401)
  })
})

test.describe('Route gating (authenticated)', () => {
  test('redirects authenticated users away from login', async ({ page }) => {
    await page.goto('/login')

    await expect(page).toHaveURL(/\/items/)
  })

  test('redirects authenticated users away from register', async ({ page }) => {
    await page.goto('/register')

    await expect(page).toHaveURL(/\/items/)
  })
})
