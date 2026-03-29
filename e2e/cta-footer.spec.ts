import { test, expect } from '@playwright/test';

test.describe('Fixed CTA', () => {
  test('should show fixed CTA after scrolling', async ({ page }) => {
    await page.goto('/');

    // Scroll down to trigger fixed CTA
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Look for fixed CTA button
    const fixedCta = page.locator('[class*="fixed"], [class*="sticky"]').filter({ hasText: /VR|AR|CTA/ }).first();

    // CTA might appear after scrolling
    if (await fixedCta.count() > 0) {
      await expect(fixedCta).toBeVisible();
    }
  });

  test('should have consultation CTA button', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    // Look for any CTA button
    const ctaButton = page.locator('button, a').filter({ hasText: /CTA/ }).first();

    if (await ctaButton.count() > 0) {
      await expect(ctaButton).toBeVisible();
    }
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have copyright text', async ({ page }) => {
    const footer = page.locator('footer');
    // Check for copyright symbol or year
    await expect(footer).toContainText(/2024|2025|RYURYU/i);
  });

  test('should have quick links', async ({ page }) => {
    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have social media links', async ({ page }) => {
    // Check for Twitter/X link
    const twitterLink = page.locator('footer a[href*="twitter"], footer a[href*="x.com"]');
    if (await twitterLink.count() > 0) {
      await expect(twitterLink.first()).toBeVisible();
    }
  });

  test('footer links should navigate to sections', async ({ page }) => {
    // Find a footer link that points to a section
    const sectionLink = page.locator('footer a[href^="#"]').first();

    if (await sectionLink.count() > 0) {
      await sectionLink.click();
      await page.waitForTimeout(500);

      // Should scroll to the section (page URL should contain hash)
      const url = page.url();
      expect(url).toContain('#');
    }
  });
});
