import { test, expect } from '@playwright/test';

test('Member Create → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const memberEmail = `member${Date.now()}@yopmail.com`;
  const memberName = 'Test';
  const memberPassword = 'test@12345';

  // ================================
  // 🔐 LOGIN
  // ================================
  await page.goto('https://beta.quickreviewer.com/#/auth/login');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/admin/);

  // ================================
  // 👥 NAVIGATE → MEMBERS (FINAL FIX)
  // ================================
 /* await page.getByRole('navigation')
    .getByRole('link', { name: 'Members', exact: true })
    .first()
    .click();

  await expect(page.getByRole('heading', { name: 'Team Members' })).toBeVisible();
*/
  // ================================
  /// Open Add Member modal
await page.locator('app-page-header')
.getByRole('button', { name: 'Add Member' })
.click();

// Fill form
await page.getByPlaceholder(/colleague@company.com/i).fill(memberEmail);
await page.getByPlaceholder(/jane smith/i).fill(memberName);

await page.getByText('Select a role...').click();
await page.getByRole('option', { name: 'Team Member' }).click();

await page.getByPlaceholder(/set initial password/i).fill(memberPassword);
await page.getByPlaceholder(/confirm/i).fill(memberPassword);

// ✅ Submit (modal scoped)
await page.getByRole('dialog')
.getByRole('button', { name: 'Add Member' })
.click();

  // ================================
  // 🔍 SEARCH MEMBER
  // ================================
  const searchBox = page.getByPlaceholder(/search name or email/i);
  await searchBox.fill(memberEmail);

  const memberRow = page.locator('table tbody tr').filter({
    hasText: memberEmail
  });

  await expect(memberRow).toBeVisible();

  // ================================
  // ✏️ EDIT MEMBER
  // ================================
  await memberRow.locator('button').first().click();

  await page.getByText('Team Member').click();
  await page.getByRole('option', { name: 'Reviewer' }).click();

  await page.getByRole('button', { name: /save changes/i }).click();

  // ================================
  // 🗑️ DELETE MEMBER
  // ================================
  await searchBox.fill(memberEmail);

  await memberRow.locator('button').nth(1).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(memberRow).toHaveCount(0);

  // ================================
  // 🚪 LOGOUT
  // ================================
  await page.getByRole('button', { name: /Admin test@gmail.com/i }).click();
  await page.getByText('Logout').click();

  await expect(page).toHaveURL(/auth\/login/);

});