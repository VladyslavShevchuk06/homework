import { test, expect, GUEST_STATE } from '../fixtures/test'
import { ItemsListPage } from '../pages/items-list.page'
import { ItemDetailPage } from '../pages/item-detail.page'

test.use({ storageState: GUEST_STATE })

test.describe('Drivers catalog', () => {
  test('home redirects to the items list', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL(/\/items/)
    await expect(new ItemsListPage(page).heading).toBeVisible()
  })

  test('lists the first page of drivers', async ({ page }) => {
    const items = new ItemsListPage(page)
    await items.goto()

    await expect(items.cards).toHaveCount(11)
    await expect(items.pageIndicator).toHaveText(/Page 1 of 2/)
  })

  test('paginates to the second page', async ({ page }) => {
    const items = new ItemsListPage(page)
    await items.goto()

    await items.nextButton.click()

    await expect(page).toHaveURL(/page=2/)
    await expect(items.cards).toHaveCount(11)
    await expect(items.pageIndicator).toHaveText(/Page 2 of 2/)
  })

  test('search narrows the results by name', async ({ page }) => {
    const items = new ItemsListPage(page)
    await items.goto()

    await items.search('Hamilton')

    await expect(page).toHaveURL(/search=Hamilton/)
    await expect(items.card('Lewis Hamilton')).toBeVisible()
    await expect(items.cards).toHaveCount(1)
  })

  test('filters by team', async ({ page }) => {
    const items = new ItemsListPage(page)
    await page.goto('/items?team=Ferrari')

    await expect(items.card('Lewis Hamilton')).toBeVisible()
    await expect(items.card('Charles Leclerc')).toBeVisible()
    await expect(items.cards).toHaveCount(2)
  })

  test('opens a driver detail page', async ({ page }) => {
    const items = new ItemsListPage(page)
    const detail = new ItemDetailPage(page)
    await items.goto()
    await items.search('Lewis Hamilton')

    await items.openDriver('Lewis Hamilton')

    await expect(page).toHaveURL(/\/items\/lewis-hamilton/)
    await expect(detail.title('Lewis Hamilton')).toBeVisible()
    await expect(page.getByText('Ferrari', { exact: true })).toBeVisible()
  })

  test('shows a not-found page for an unknown driver', async ({ page }) => {
    await page.goto('/items/no-such-driver')

    await expect(page.getByRole('heading', { name: 'Driver not found' })).toBeVisible()
  })
})
