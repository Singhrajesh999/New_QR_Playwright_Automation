import { test, expect } from '@playwright/test';

test('Status Create → Edit → Delete', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const statusName = 'Rajesh Status';
  const updatedStatusName = 'Rajesh Test Status';
  const description = 'Status test';

  // ---------- LOGIN ----------
  await page.goto('https://beta.quickreviewer.com/#/auth/login');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/admin/);

  // ---------- NAVIGATION ----------
  await page.getByRole('link', { name: 'Statuses' }).click();
  await expect(page.getByRole('heading', { name: 'Review Statuses' })).toBeVisible();

  // =====================================================
  // ---------- CREATE STATUS ----------
  // =====================================================

  await page.getByRole('button', { name: /add status/i }).click();

  // Fill name
  await page.getByPlaceholder(/on hold/i).fill(statusName);

  // Fill description
  await page.getByPlaceholder(/when should reviewers/i).fill(description);

  // Create
  await page.getByRole('button', { name: /create status/i }).click();

  // Verify created
  const statusRow = page.locator('table tbody tr').filter({
    hasText: statusName
  });

  await expect(statusRow).toBeVisible();

  // =====================================================
  // ---------- EDIT STATUS ----------
  // =====================================================

  await statusRow.locator('button').first().click(); // edit icon

  // Clear & update name
  const nameInput = page.getByPlaceholder(/on hold/i);
  await nameInput.fill('');
  await nameInput.fill(updatedStatusName);

  // Save changes
  await page.getByRole('button', { name: /save changes/i }).click();

  // Verify updated
  const updatedRow = page.locator('table tbody tr').filter({
    hasText: updatedStatusName
  });

  await expect(updatedRow).toBeVisible();

  // =====================================================
  // ---------- DELETE STATUS ----------
  // =====================================================

  await updatedRow.locator('button').nth(1).click(); // delete icon

  // Confirm delete
  await page.getByRole('button', { name: 'Delete' }).click();

  // Verify deletion
  await expect(updatedRow).toHaveCount(0);

  // ================================
  // 🚪 LOGOUT
  // ================================
  await page.getByRole('button', { name: /Admin test@gmail.com/i }).click();
  await page.getByText('Logout').click();

  await expect(page).toHaveURL(/auth\/login/);


});