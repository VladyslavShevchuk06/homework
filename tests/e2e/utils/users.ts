export interface ITestUser {
  name: string
  email: string
  password: string
}

export const TEST_USER: ITestUser = {
  name: 'E2E Shared User',
  email: 'e2e-shared@example.com',
  password: 'e2e-password-123',
}

export function makeUser(token: string): ITestUser {
  return {
    name: `E2E User ${token}`,
    email: `e2e-${token}@example.com`,
    password: 'e2e-password-123',
  }
}
