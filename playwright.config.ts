import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.test.local' })
loadEnv({ path: '.env.test' })

const baseURL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3100'

export default defineConfig({
  testDir: './test/e2e/tests',
  globalSetup: './test/e2e/setup/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['json', { outputFile: 'playwright-report/results.json' }]]
    : [['html', { open: 'never' }], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testDir: './test/e2e/setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'test/e2e/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: process.env.CI ? 'yarn start:e2e' : 'yarn dev:e2e',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
