import { test, expect } from '../test-fixtures';

test.describe('Product option test', () => {
   test('Different styles', async ({ page, productPage, cartDrawer }) => {
      await productPage.gotoProduct('repair-business-toolkit');

      await expect(page.getByText('Style')).toBeVisible();

      // Get the price, sku, and name for the first product option
      const firstOptionPrice = await productPage.getCurrentPrice();
      const firstOptionSku = await productPage.getSku();
      const firstOptionName = await page
         .getByTestId('product-variants-selector')
         .locator('option')
         .nth(0)
         .textContent();

      // Add the first product option to the cart
      await productPage.addToCart();
      await cartDrawer.close();

      // Switch to the second product option
      await page
         .getByTestId('product-variants-selector')
         .selectOption({ index: 1 });
      expect(await productPage.getSku()).not.toContain(firstOptionSku);

      // Get the price, sku, and name for the second product option
      const secondOptionPrice = await productPage.getCurrentPrice();
      const secondOptionSku = await productPage.getSku();
      const secondOptionName = await page
         .getByTestId('product-variants-selector')
         .locator('option')
         .nth(1)
         .textContent();

      expect(firstOptionName).not.toEqual(secondOptionName);

      // Add the second product option to the cart
      await productPage.addToCart();

      // Assert that the cart drawer contains the skus of the added products
      await cartDrawer.assertItemIsPresent(firstOptionSku);
      await cartDrawer.assertItemIsPresent(secondOptionSku);

      // Assert that the cart drawer contains the prices of the added products
      expect(await cartDrawer.getItem(firstOptionSku)).toHaveText(
         firstOptionPrice
      );
      expect(await cartDrawer.getItem(secondOptionSku)).toHaveText(
         secondOptionPrice
      );
   });
});
