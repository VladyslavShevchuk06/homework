import { type Page, type Locator } from '@playwright/test'
import { type ITestUser } from '../utils/users'
import { fillAllStable } from '../utils/form'

export class LoginPage {
  readonly title: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly rootError: Locator

  constructor(private readonly page: Page) {
    this.title = page.getByRole('heading', { name: 'Sign In' })
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.submitButton = page.getByRole('button', { name: 'Sign In', exact: true })
    this.rootError = page.locator('form div.bg-red-50')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(user: Pick<ITestUser, 'email' | 'password'>) {
    await fillAllStable([
      [this.emailInput, user.email],
      [this.passwordInput, user.password],
    ])
    await this.submitButton.click()
  }
}
