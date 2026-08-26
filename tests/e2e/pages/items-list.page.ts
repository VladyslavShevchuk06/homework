import { type Page, type Locator } from '@playwright/test'

export class ItemsListPage {
  readonly heading: Locator
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly clearButton: Locator
  readonly cards: Locator
  readonly pageIndicator: Locator
  readonly nextButton: Locator
  readonly previousButton: Locator
  readonly emptyMessage: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'F1 2026 Drivers' })
    this.searchInput = page.getByPlaceholder('Search drivers by name or team...')
    this.searchButton = page.getByRole('button', { name: 'Search' })
    this.clearButton = page.getByRole('button', { name: 'Clear' })
    this.cards = page.getByTestId('driver-card')
    this.pageIndicator = page.getByText(/Page \d+ of \d+/)
    this.nextButton = page.getByRole('button', { name: 'Next →' })
    this.previousButton = page.getByRole('button', { name: '← Previous' })
    this.emptyMessage = page.getByText(/No drivers/)
  }

  async goto() {
    await this.page.goto('/items')
  }

  card(name: string): Locator {
    return this.cards.filter({ hasText: name })
  }

  async search(term: string) {
    await this.searchInput.fill(term)
    await this.searchButton.click()
  }

  async openDriver(name: string) {
    await this.card(name).first().click()
  }
}
