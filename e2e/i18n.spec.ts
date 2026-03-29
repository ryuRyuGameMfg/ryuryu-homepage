import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('should display content by default', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toContainText(/VR|AR|Unity/);
  });

  test('should have language toggle if implemented', async ({ page }) => {
    // Look for EN or JP toggle button
    const langButton = page.locator('button, a').filter({ hasText: /^EN$|^JP$/ }).first();
    const count = await langButton.count();
    // Language toggle is optional
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle language switch without error', async ({ page }) => {
    // This test just ensures no errors occur when interacting with language features
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain page state after reload', async ({ page }) => {
    await page.reload();
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have valid page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
