// @ts-nocheck
 import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:16078/annual-consumptions');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Consumos Anuales/);
});

test('Create and delete consumption', async ({ page }) => {
  const aacc = "Murcia, Región de";
  const year = 2025;
  const electricity = 123456.78;
  const gas = 234567.89;
  const other = 345678.90;
  const total_consumption = 345678.90;
  const co2_emission = 456789.01;

  await page.goto('http://localhost:16078/annual-consumptions');

  await page.getByRole('textbox').nth(0).fill(aacc);
  await page.getByRole('textbox').nth(1).fill(year.toString());
  await page.getByRole('textbox').nth(2).fill(electricity.toString());
  await page.getByRole('textbox').nth(3).fill(gas.toString());
  await page.getByRole('textbox').nth(4).fill(other.toString());
  await page.getByRole('textbox').nth(5).fill(total_consumption.toString());
  await page.getByRole('textbox').nth(6).fill(co2_emission.toString());

  await page.getByRole('button', { name: 'Crear' }).click();

  const consumptionRow = page.locator('tr', { hasText: year.toString() });
  await expect(consumptionRow).toContainText(aacc);


  const deleteButton = consumptionRow.locator('button', {hasText: 'Borrar'});
  await deleteButton.click();

  await expect(consumptionRow).toHaveCount(0);
});