//D:\playwright-mcp\mock-mcp-backend\tests\api\api.chat.spec.ts


import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:3000/api/user');
  const content = await page.textContent('body');
  expect(content).toContain('Alice');
});
