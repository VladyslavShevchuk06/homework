import { test, expect, GUEST_STATE } from '../fixtures/test'
import { LoginPage } from '../pages/login.page'
import { RegisterPage } from '../pages/register.page'
import { NavComponent } from '../pages/nav.component'
import { TEST_USER } from '../utils/users'

test.use({ storageState: GUEST_STATE })

test.describe('Authentication', () => {
  test('registers a new account and lands on the catalog', async ({ page, newUser }) => {
    const registerPage = new RegisterPage(page)
    const nav = new NavComponent(page)
    await registerPage.goto()

    await registerPage.register(newUser())

    await expect(page).toHaveURL(/\/items/)
    await expect(nav.logoutButton).toBeVisible()
  })

  test('signs in an existing user', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const nav = new NavComponent(page)
    await loginPage.goto()

    await loginPage.login(TEST_USER)

    await expect(page).toHaveURL(/\/items/)
    await expect(nav.logoutButton).toBeVisible()
  })

  test('rejects invalid credentials with a form error', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.login({ email: TEST_USER.email, password: 'wrong-password-99' })

    await expect(loginPage.rootError).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('validates a short password', async ({ page, newUser }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()

    await registerPage.register({ ...newUser(), password: 'short' })

    await expect(registerPage.passwordError).toHaveText('Password must be at least 8 characters')
    await expect(page).toHaveURL(/\/register/)
  })

  test('validates mismatched password confirmation', async ({ page, newUser }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()

    await registerPage.register(newUser(), 'different-password')

    await expect(registerPage.confirmPasswordError).toHaveText("Passwords don't match")
    await expect(page).toHaveURL(/\/register/)
  })
})
