import { type Page, type Locator } from '@playwright/test'

export class FavoritesPage {
  readonly heading: Locator
  readonly emptyMessage: Locator
  readonly cards: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'My Favorite Drivers' })
    this.emptyMessage = page.getByText('No favorites yet')
    this.cards = page.getByTestId('driver-card')
  }

  async goto() {
    await this.page.goto('/favorites')
  }

  card(name: string): Locator {
    return this.cards.filter({ hasText: name })
  }
}
