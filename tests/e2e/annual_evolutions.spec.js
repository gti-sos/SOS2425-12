// @ts-check               
import { test, expect } from '@playwright/test'; 
test('has title', async ({ page }) => {
  await page.goto('http://localhost:16078/about'); // Navega a la página /about.

  // Espera que el título de la página contenga "Información del proyecto".
  await expect(page).toHaveTitle(/Información del proyecto/); 
});

test('Create and delete data', async ({ page }) => {
  // Define los datos a introducir.
  const aacc = "Cantabria";                          
  const year = 2025;                                  
  const technology = "Residuos";                      
  const energy_sold = 374.5;                          
  const installed_power = 275;                       
  const load_factor = 15.38;                         

  await page.goto('http://localhost:16078/annual-evolutions'); // Abre la página de evoluciones anuales.

  
  // await page.getByRole('textbox').nth(0).fill(aacc);                       
  // await page.getByRole('textbox').nth(1).fill(year.toString());           
  // await page.getByRole('textbox').nth(2).fill(technology);                
  // await page.getByRole('textbox').nth(3).fill(energy_sold.toString());    
  // await page.getByRole('textbox').nth(4).fill(installed_power.toString()); 
  // await page.getByRole('textbox').nth(5).fill(load_factor.toString());    

  await page.getByRole('textbox', { name: 'Ej: Ceuta' }).fill(aacc);
  await page.getByPlaceholder('Ej: 2000').fill(year.toString());
  await page.getByRole('textbox', { name: 'Ej: Residuos' }).fill(technology);
  await page.getByPlaceholder('Ej: 300').fill(energy_sold.toString());
  await page.getByPlaceholder('Ej: 100').fill(installed_power.toString());
  await page.getByPlaceholder('Ej: 40').fill(load_factor.toString());

  await page.getByRole('button', { name: 'Crear' }).click(); // Hace clic en el botón "Crear".
  await page.waitForTimeout(500); // espera medio segundo


  // Localiza la fila correspondiente al año ingresado.
  const dataRow = page.locator('tr').filter({
    hasText: aacc
  }).filter({
    hasText: year.toString()
  }).filter({
    hasText: technology
  });
  
  await expect(dataRow).toHaveCount(1); // Asegúrate de que la fila apareció antes de comprobar su texto
  await expect(dataRow).toContainText(aacc);   // Verifica que esa fila contenga el texto de algun dato añadido.

  // Encuentra el botón "Borrar" dentro de esa fila.
  const deleteButton = dataRow.locator('button', { hasText: 'Borrar' });

  await deleteButton.click(); // Clic en "Borrar".

  // Verifica que la fila haya desaparecido del DOM.
  await expect(dataRow).toHaveCount(0); 
});
