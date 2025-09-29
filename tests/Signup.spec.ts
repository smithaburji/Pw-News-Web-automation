import { test, expect } from '@playwright/test';

//generate random strings for form fields
function randomAlphaString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));

  }

  return result;
}

const firstName = randomAlphaString();
const lastName = randomAlphaString();
const email = `user_${Date.now()}@example.com`;
const password = randomAlphaString() + Math.floor(Math.random() * 1000) + 'A!';

test('test', async ({ page }) => {

  await test.step('Navigate to news.com.au', async () => {
    await page.goto('https://www.news.com.au/');
    page.setDefaultNavigationTimeout(60000);
  });

  await test.step('Click Signup link', async () => {
    await expect(page.getByRole('banner').getByRole('link', { name: 'Sign Up' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Sign Up' }).click();
  });

  await test.step('Fill the Signup form', async () => {


    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByTestId('Email').click();
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByTestId('Email').fill(email);
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'Create password*' }).click();
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'Create password*' }).fill(password);
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'First Name*' }).click();
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'First Name*' }).fill(firstName);
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'Last Name*' }).click();
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'Postcode*' }).click();
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('textbox', { name: 'Postcode*' }).fill('4122');
    await page.locator('iframe[title="spc-iframe"]').contentFrame().locator('div').filter({ hasText: /^Wishart 4122, QLD, AUSTRALIA$/ }).first().click();
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('checkbox').check();
  });

  await test.step('Submit the form', async () => {
    await page.locator('iframe[title="spc-iframe"]').contentFrame().getByRole('button', { name: 'Create account and complete' }).click();
    await page.waitForTimeout(30000); // Wait for 30 seconds to allow for form submission and page load
    await expect(page.locator('h1')).toContainText('Thanks for registering');
    await expect(page.getByText('Your confirmation email will be sent to')).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();

  });
});