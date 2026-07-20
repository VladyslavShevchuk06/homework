import { test, expect, GUEST_STATE } from '../fixtures/test'
import { RegisterPage } from '../pages/register.page'
import { ItemDetailPage } from '../pages/item-detail.page'
import { FavoritesPage } from '../pages/favorites.page'

test.use({ storageState: GUEST_STATE })

const DRIVER_SLUG = 'max-verstappen'
const DRIVER_NAME = 'Max Verstappen'

test.describe('Favorites', () => {
  test.beforeEach(async ({ page, newUser }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await registerPage.register(newUser())
    await expect(page).toHaveURL(/\/items/)
  })

  test('adds a driver to favorites', async ({ page }) => {
    const detail = new ItemDetailPage(page)
    const favorites = new FavoritesPage(page)
    await detail.goto(DRIVER_SLUG)

    await expect(detail.addButton).toBeVisible()
    await detail.addButton.click()
    await expect(detail.removeButton).toBeVisible()

    await favorites.goto()
    await expect(favorites.card(DRIVER_NAME)).toBeVisible()
  })

  test('removes a driver from favorites', async ({ page }) => {
    const detail = new ItemDetailPage(page)
    const favorites = new FavoritesPage(page)
    await detail.goto(DRIVER_SLUG)

    await expect(detail.addButton).toBeVisible()
    await detail.addButton.click()
    await expect(detail.removeButton).toBeVisible()

    await detail.removeButton.click()
    await expect(detail.addButton).toBeVisible()

    await favorites.goto()
    await expect(favorites.emptyMessage).toBeVisible()
  })
})
