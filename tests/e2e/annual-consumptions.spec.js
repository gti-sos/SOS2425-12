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

  // Selecciona la fila de creación dentro de la tabla correcta
  const creationRow = page.locator('#consumption-table tbody tr').first();

  await creationRow.locator('input').nth(0).fill(aacc);
  await creationRow.locator('input').nth(1).fill(year.toString());
  await creationRow.locator('input').nth(2).fill(electricity.toString());
  await creationRow.locator('input').nth(3).fill(gas.toString());
  await creationRow.locator('input').nth(4).fill(other.toString());
  await creationRow.locator('input').nth(5).fill(total_consumption.toString());
  await creationRow.locator('input').nth(6).fill(co2_emission.toString());

  await creationRow.getByRole('button', { name: 'Crear' }).click();

  // Verifica que el dato aparece en la tabla
  const consumptionRow = page.locator('#consumption-table tr', { hasText: year.toString() });
  await expect(consumptionRow).toContainText(aacc);

  // Elimina el dato
  const deleteButton = consumptionRow.locator('button', { hasText: 'Borrar' });
  await deleteButton.click();

  // Confirma que ha sido eliminado
  await expect(consumptionRow).toHaveCount(0);
});