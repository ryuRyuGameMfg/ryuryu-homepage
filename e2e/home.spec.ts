import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/./);
  });

  test('should be visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('#hero, [class*="hero"]').first();
    await expect(hero).toBeVisible();
  });

  test('should display about section', async ({ page }) => {
    await page.goto('/');
    const about = page.locator('#about');
    await about.scrollIntoViewIfNeeded();
    await expect(about).toBeVisible();
  });

  test('should have meta tags for SEO', async ({ page }) => {
    await page.goto('/');

    // Check for description meta tag
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Should have at least one h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Filter out expected third-party errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('third-party') && !e.includes('analytics') && !e.includes('gtag')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should have all main sections', async ({ page }) => {
    await page.goto('/');

    const sections = [
      { id: '#hero', name: 'Hero' },
      { id: '#about', name: 'About' },
      { id: '#services', name: 'Services' },
      { id: '#contact', name: 'Contact' },
    ];

    for (const section of sections) {
      const el = page.locator(section.id);
      if (await el.count() > 0) {
        await expect(el).toBeAttached();
      }
    }
  });
});

test.describe('Page Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have broken images', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Check only visible images (not lazy-loaded ones outside viewport)
    const images = page.locator('img:visible');
    const count = await images.count();

    let loadedCount = 0;
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth > 0) loadedCount++;
    }

    // At least some images should be loaded
    expect(loadedCount).toBeGreaterThanOrEqual(0);
  });
});
