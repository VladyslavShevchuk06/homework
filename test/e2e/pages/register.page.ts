import { type Page, type Locator } from '@playwright/test'
import { type ITestUser } from '../utils/users'
import { fillAllStable } from '../utils/form'

export class RegisterPage {
  readonly title: Locator
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly submitButton: Locator
  readonly emailError: Locator
  readonly passwordError: Locator
  readonly confirmPasswordError: Locator

  constructor(private readonly page: Page) {
    this.title = page.getByRole('heading', { name: 'Create Account' })
    this.nameInput = page.locator('#name')
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.confirmPasswordInput = page.locator('#confirmPassword')
    this.submitButton = page.getByRole('button', { name: 'Sign Up', exact: true })
    this.emailError = page.getByTestId('email-error')
    this.passwordError = page.getByTestId('password-error')
    this.confirmPasswordError = page.getByTestId('confirmPassword-error')
  }

  async goto() {
    await this.page.goto('/register')
  }

  async register(user: ITestUser, confirmPassword?: string) {
    await fillAllStable([
      [this.nameInput, user.name],
      [this.emailInput, user.email],
      [this.passwordInput, user.password],
      [this.confirmPasswordInput, confirmPassword ?? user.password],
    ])
    await this.submitButton.click()
  }
}
