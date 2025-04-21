// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:16078/about');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Información del proyecto/);
});

test('Create and delete retribution', async ({ page }) => {

  const year = 2025;
  const technology = "Biomasa";
  const subsidized_energy = 3984.8567;
  const total_compensation = 536521.12;
  const investment_compensation = 148150.2;
  const operation_compensation = 178340.4;
  const specific_compensation = 326490.61;
  const aacc = "Murcia, Región de";

  await page.goto('http://localhost:16078/annual-retributions');
  await page.getByRole('textbox').nth(0).fill(year.toString());
  await page.getByRole('textbox').nth(1).fill(technology);
  await page.getByRole('textbox').nth(2).fill(subsidized_energy.toString());
  await page.getByRole('textbox').nth(3).fill(total_compensation.toString());
  await page.getByRole('textbox').nth(4).fill(investment_compensation.toString());
  await page.getByRole('textbox').nth(5).fill(operation_compensation.toString());
  await page.getByRole('textbox').nth(6).fill(specific_compensation.toString());
  await page.getByRole('textbox').nth(7).fill(aacc);
  await page.getByRole('button', { name: 'Crear' }).click();

  const retributionRow = page.locator('tr', {hasText: year.toString()});
  await expect(retributionRow).toContainText(technology);

  const deleteButton = retributionRow.locator('button', {hasText: 'Borrar'});
  await deleteButton.click();

  await expect(retributionRow).toHaveCount(0);
  
});

