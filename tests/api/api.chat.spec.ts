import { test, expect, request } from '@playwright/test';

test('basic API test', async () => {
  const apiContext = await request.newContext();
  const response = await apiContext.get('http://localhost:3000/api/user');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toEqual({ id: 1, name: 'Alice' });
});
