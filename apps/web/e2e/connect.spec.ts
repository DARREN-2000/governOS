import { test, expect } from '@playwright/test';

test('connect flow saves API base to localStorage', async ({ page, baseURL }) => {
  await page.goto('/');
  await page.click('button:has-text("Connect API")');
  await page.fill('input[placeholder="https://api.example.com"]', 'https://api.test.local');
  await page.fill('input[placeholder="optional secret (exposed in browser)"]', 'test-key-123');
  await page.click('button:has-text("Save")');

  const stored = await page.evaluate(() => window.localStorage.getItem('intentgraph_api_base'));
  expect(stored).toBe('https://api.test.local');
});
