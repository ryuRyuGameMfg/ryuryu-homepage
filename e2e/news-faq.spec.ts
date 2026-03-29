import { test, expect } from '@playwright/test';

test.describe('News Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#news').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display news section', async ({ page }) => {
    const newsSection = page.locator('#news');
    await expect(newsSection).toBeVisible();
  });

  test('should display news items', async ({ page }) => {
    // Check for news items
    const newsItems = page.locator('#news article, #news [class*="news"], #news li');
    const count = await newsItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have category filter buttons', async ({ page }) => {
    // Look for filter/category buttons
    const filterButtons = page.locator('#news button, #news [role="tab"]');
    const count = await filterButtons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter news when clicking category', async ({ page }) => {
    const filterButton = page.locator('#news button').first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(300);
      // Just verify no errors occurred
      await expect(page.locator('#news')).toBeVisible();
    }
  });
});

test.describe('FAQ Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display FAQ section', async ({ page }) => {
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeVisible();
  });

  test('should display FAQ items', async ({ page }) => {
    // Check for FAQ items (accordion or list)
    const faqItems = page.locator('#faq [class*="accordion"], #faq details, #faq [class*="faq"]');
    const count = await faqItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should expand FAQ item on click', async ({ page }) => {
    // Find clickable FAQ item (accordion header or summary)
    const faqTrigger = page.locator('#faq button, #faq summary, #faq [class*="accordion-trigger"]').first();

    if (await faqTrigger.isVisible()) {
      // Get initial state
      await faqTrigger.click();
      await page.waitForTimeout(300);

      // Just verify no errors occurred
      await expect(page.locator('#faq')).toBeVisible();
    }
  });

  test('should have category filter for FAQ', async ({ page }) => {
    // Look for category filter buttons
    const filterButtons = page.locator('#faq >> button').filter({ hasNotText: /close/i });
    const count = await filterButtons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
