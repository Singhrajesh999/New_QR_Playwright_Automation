import { test, expect } from '@playwright/test';

test('Group Create → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const groupName = `Test_Group`;
  const workspaceUser = 'clavis890tech@gmail.com';
  const externalEmail = 'test1@yopmail.com';

  // ---------- LOGIN ----------
  await page.goto('https://beta.quickreviewer.com/#/auth/login');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/admin/);

  // ---------- NAVIGATION ----------
  await page.getByRole('link', { name: 'Groups' }).click();
  await expect(page.getByRole('heading', { name: 'Groups' })).toBeVisible();

  // =====================================================
  // ---------- CREATE GROUP ----------
  // =====================================================

  await page.getByRole('button', { name: /new group/i }).click();

  // Group name
  await page.getByPlaceholder(/legal team/i).fill(groupName);

  // Workspace member
  const memberSearch = page.getByPlaceholder(/search members/i);
  await memberSearch.fill(workspaceUser);
  await page.getByRole('button', { name: new RegExp(workspaceUser) }).click();

  // External email
  const externalInput = page.getByPlaceholder(/name@company.com/i);
  await externalInput.fill(externalEmail);
  await page.getByRole('button', { name: 'Add' }).click();

  // Create group
  await page.getByRole('button', { name: /create group/i }).click();

  // Verify created
  const groupRow = page.locator('table tbody tr').filter({
    hasText: groupName
  });

  await expect(groupRow).toBeVisible();

  // =====================================================
  // ---------- EDIT GROUP ----------
// =====================================================

await groupRow.locator('button').first().click(); // open edit modal

// ✅ Re-locate inside edit modal
const editMemberSearch = page.getByPlaceholder(/search members/i);

// ---------- Add workspace member ----------
await editMemberSearch.fill('lekhu123@yopmail.com');

// select from dropdown
await page.getByRole('button', { name: /lekhu123@yopmail.com/i }).click();

// ---------- Save changes ----------
await page.getByRole('button', { name: /save changes/i }).click();

 // ---------- DELETE GROUP ----------
await groupRow.locator('button').nth(1).click(); // open delete popup

const deleteBtn = page.getByRole('button', { name: 'Delete' });
await expect(deleteBtn).toBeVisible();
await deleteBtn.click();

await expect(groupRow).toHaveCount(0);

// Verify deletion
await expect(groupRow).toHaveCount(0);

  // =====================================================
  // ---------- LOGOUT ----------
  // =====================================================

  await page.getByRole('button', { name: /Admin test@gmail.com/i }).click();
  await page.getByText('Logout').click();

  await expect(page).toHaveURL(/auth\/login/);

});