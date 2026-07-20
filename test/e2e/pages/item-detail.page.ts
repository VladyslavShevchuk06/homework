import { type Page, type Locator } from '@playwright/test'

export class ItemDetailPage {
  readonly backLink: Locator
  readonly addButton: Locator
  readonly removeButton: Locator
  readonly favoriteToggle: Locator

  constructor(private readonly page: Page) {
    this.backLink = page.getByRole('link', { name: '← Back to drivers' })
    this.addButton = page.getByRole('button', { name: '☆ Add to Favorites' })
    this.removeButton = page.getByRole('button', { name: '★ Remove from Favorites' })
    this.favoriteToggle = page.getByRole('button', { name: /to Favorites/ })
  }

  async goto(slug: string) {
    await this.page.goto(`/items/${slug}`)
  }

  title(name: string): Locator {
    return this.page.getByRole('heading', { name })
  }
}
