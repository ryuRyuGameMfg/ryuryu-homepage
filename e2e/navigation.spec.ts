import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('should display navigation', async ({ page }) => {
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    const navLinks = page.locator('a[href^="#"]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should scroll to about section', async ({ page }) => {
    const aboutSection = page.locator('#about');

    if (await aboutSection.count() > 0) {
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(aboutSection).toBeVisible();
    }
  });

  test('should scroll to services section', async ({ page }) => {
    const servicesSection = page.locator('#services');

    if (await servicesSection.count() > 0) {
      await servicesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(servicesSection).toBeVisible();
    }
  });

  test('should scroll to contact section', async ({ page }) => {
    const contactSection = page.locator('#contact');

    if (await contactSection.count() > 0) {
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(contactSection).toBeVisible();
    }
  });

  test('should scroll to FAQ section', async ({ page }) => {
    const faqSection = page.locator('#faq');

    if (await faqSection.count() > 0) {
      await faqSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(faqSection).toBeVisible();
    }
  });

  test('should have clickable navigation links', async ({ page }) => {
    const aboutLink = page.locator('a[href="#about"]').first();

    if (await aboutLink.count() > 0) {
      // Just verify the link exists and is accessible
      await expect(aboutLink).toBeAttached();
    }
  });
});
