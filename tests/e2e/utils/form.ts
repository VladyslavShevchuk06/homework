import { expect, type Locator } from '@playwright/test'

export async function fillAllStable(entries: Array<[Locator, string]>) {
  await expect(async () => {
    for (const [locator, value] of entries) {
      await locator.fill(value)
    }
    for (const [locator, value] of entries) {
      await expect(locator).toHaveValue(value, { timeout: 500 })
    }
  }).toPass({ timeout: 15_000 })
}
