import { type Page, type Locator } from '@playwright/test'

export class NavComponent {
  readonly brand: Locator
  readonly driversLink: Locator
  readonly favoritesLink: Locator
  readonly loginLink: Locator
  readonly registerLink: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.brand = page.getByRole('link', { name: 'F1 Catalog' })
    this.driversLink = page.getByRole('link', { name: 'Drivers' })
    this.favoritesLink = page.getByRole('link', { name: 'Favorites' })
    this.loginLink = page.getByRole('link', { name: 'Login' })
    this.registerLink = page.getByRole('link', { name: 'Register' })
    this.logoutButton = page.getByRole('button', { name: 'Logout' })
  }
}
