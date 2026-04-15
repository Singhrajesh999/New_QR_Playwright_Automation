import { test, expect } from '@playwright/test';

test('Login scenarios', async ({ page }) => {

  // Open login page
  await page.goto('https://beta.quickreviewer.com/#/auth/login');

  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  const loginButton = page.getByRole('button', { name: 'Sign in' });

  console.log("Step 1 → Blank login attempt");

  await loginButton.click();
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();

  console.log("Step 2 → Wrong password login attempt");

  await emailInput.fill('qrtest00@gmail.com');
  await passwordInput.fill('wrongpassword123');

  await loginButton.click();
  await expect(page.getByText(/Wrong password/i)).toBeVisible();

  console.log("Step 3 → Correct login attempt");

  await passwordInput.fill('');
  await passwordInput.fill('adobetesting');

  await loginButton.click();

  // Dashboard URL
  await expect(page).toHaveURL(/admin\/team/);
  //use unique locator (heading)
   await expect(
    page.getByRole('heading', { name: 'Team Members' })
  ).toBeVisible();

  // =====================================
  // Step 4 → Logout
  // =====================================

  console.log("Step 4 → Logout");

  //  Click FULL profile button.
  const profileButton = page.getByRole('button', { name: /Admin test@gmail.com/i });
  await profileButton.click();

  //  Wait for dropdown
  const logoutButton = page.getByText('Logout');
  await expect(logoutButton).toBeVisible();

  //  Click logout
  await logoutButton.click();

  //  Verify logout
  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

});