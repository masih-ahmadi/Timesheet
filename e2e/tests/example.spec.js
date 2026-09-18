// @ts-check
const { test, expect } = require('@playwright/test');

/** @param {import('@playwright/test').Page} page */
const gotoApp = async (page, path = '/') => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
};

test('homepage lists timesheets', async ({ page }) => {
  await gotoApp(page, '/');
  await expect(page).toHaveTitle('FUNDED');
  await expect(page.getByRole('heading', { name: 'Timesheets' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'New timesheet' })).toBeVisible();
});

test('create timesheet, record hours, and see them on the calendar', async ({
  page,
}) => {
  // Avoid the current year: monthly view opens on "today's month".
  const currentYear = new Date().getFullYear();
  const year = currentYear >= 2030 ? 2029 : Math.min(currentYear + 1, 2030);
  const sampleDate = `${year}-01-06`;

  await gotoApp(page, '/years/new');
  await page.getByLabel('Year').fill(String(year));
  await page.getByLabel('Region').selectOption({ label: 'Berlin' });
  await page.getByRole('button', { name: 'Create timesheet' }).click();

  await page.waitForURL(/\/years\/\d+/, { timeout: 120_000 });
  await expect(page.getByText('Loading timesheet')).toHaveCount(0, {
    timeout: 120_000,
  });
  await expect(
    page.getByRole('heading', { name: `Timesheet ${year}` }),
  ).toBeVisible();

  await page.getByRole('tab', { name: 'Yearly' }).click();

  const dayButton = page.locator(`button[title^="${sampleDate}"]`);
  await expect(dayButton).toBeVisible({ timeout: 30_000 });
  await dayButton.click();

  await expect(page.getByRole('heading', { name: sampleDate })).toBeVisible();
  await page.getByLabel('Hours', { exact: true }).fill('8');
  await page.getByRole('button', { name: 'Save day' }).click();

  await expect(
    page.locator(`button[title^="${sampleDate}"][title*="Hours: 8"]`),
  ).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText('8h', { exact: true })).toBeVisible();
});
