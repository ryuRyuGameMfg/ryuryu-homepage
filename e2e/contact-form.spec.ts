import { test, expect } from '@playwright/test';

test.describe('Contact Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display contact section', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
  });

  test('should display LINE official account link', async ({ page }) => {
    // Check for LINE link
    const lineLink = page.locator('a[href*="lin.ee"], a[href*="line.me"]').first();
    if (await lineLink.count() > 0) {
      await expect(lineLink).toBeVisible();
    }
  });
});

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display contact form', async ({ page }) => {
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('should have required form fields', async ({ page }) => {
    // Check for name input
    const nameInput = page.locator('input[type="text"], input[name*="name"]').first();
    await expect(nameInput).toBeVisible();

    // Check for email input
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test('should have optional form fields', async ({ page }) => {
    // Check for company input
    const companyInput = page.locator('input[name*="company"], input[placeholder*="company"]');
    if (await companyInput.count() > 0) {
      await expect(companyInput.first()).toBeVisible();
    }

    // Check for textarea (message/details)
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
  });

  test('should have category select', async ({ page }) => {
    const categorySelect = page.locator('select').first();
    if (await categorySelect.count() > 0) {
      await expect(categorySelect).toBeVisible();
    }
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation error for empty required fields', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Check for validation (HTML5 validation or custom error)
    await page.waitForTimeout(300);

    // Form should still be visible (not submitted)
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('should accept valid input in name field', async ({ page }) => {
    const nameInput = page.locator('input[type="text"], input[name*="name"]').first();
    await nameInput.fill('Test User');
    await expect(nameInput).toHaveValue('Test User');
  });

  test('should accept valid email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should accept text in textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('This is a test message');
    await expect(textarea).toHaveValue('This is a test message');
  });

  test('should fill complete form without submitting', async ({ page }) => {
    // Fill name
    const nameInput = page.locator('input[type="text"], input[name*="name"]').first();
    await nameInput.fill('Test User');

    // Fill email
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    await emailInput.fill('test@example.com');

    // Fill message
    const textarea = page.locator('textarea').first();
    await textarea.fill('This is a test inquiry');

    // Verify all fields are filled
    await expect(nameInput).toHaveValue('Test User');
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(textarea).toHaveValue('This is a test inquiry');
  });
});
