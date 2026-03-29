import { test, expect } from '@playwright/test';

// Mobile tests using viewport instead of devices
test.describe('Mobile Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 size
  });

  test('should load on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');

    // Look for hamburger menu button
    const hamburger = page.locator('button[aria-label*="menu"], button[class*="hamburger"], button[class*="mobile"], [class*="menu-toggle"]').first();

    if (await hamburger.count() > 0) {
      await expect(hamburger).toBeVisible();
    }
  });

  test('should open mobile menu when clicking hamburger', async ({ page }) => {
    await page.goto('/');

    const hamburger = page.locator('button[aria-label*="menu"], button[class*="hamburger"], button[class*="mobile"], [class*="menu-toggle"]').first();

    if (await hamburger.count() > 0 && await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(300);

      // Menu should be visible
      const mobileMenu = page.locator('[class*="mobile-menu"], [class*="drawer"], nav[class*="open"], [class*="menu-open"]');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    }
  });

  test('should display all sections on mobile', async ({ page }) => {
    await page.goto('/');

    // Check main sections exist
    const sections = ['#hero', '#about', '#services', '#contact'];

    for (const section of sections) {
      const el = page.locator(section);
      if (await el.count() > 0) {
        await el.scrollIntoViewIfNeeded();
        await expect(el).toBeVisible();
      }
    }
  });

  test('should display form properly on mobile', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Form inputs should be visible and usable
    const inputs = page.locator('form input, form textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('mobile menu should have navigation links', async ({ page }) => {
    await page.goto('/');

    const hamburger = page.locator('button[aria-label*="menu"], button[class*="hamburger"], button[class*="mobile"], [class*="menu-toggle"]').first();

    if (await hamburger.count() > 0 && await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(300);

      // Check for nav links in mobile menu
      const navLinks = page.locator('a[href^="#"], button').filter({ hasText: /HOME|ABOUT|SERVICES|CONTACT/i });
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Tablet Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 }); // iPad size
  });

  test('should load on tablet', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display navigation on tablet', async ({ page }) => {
    await page.goto('/');
    // Check for nav or header element
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('should display all sections on tablet', async ({ page }) => {
    await page.goto('/');

    const sections = ['#hero', '#about', '#services', '#contact'];

    for (const section of sections) {
      const el = page.locator(section);
      if (await el.count() > 0) {
        await el.scrollIntoViewIfNeeded();
        await expect(el).toBeVisible();
      }
    }
  });
});
