import { test, expect } from '../test-fixtures';

test.describe('Cross-sell test', () => {
   test.beforeEach(async ({ page }) => {
      await page.goto('/products/iphone-6s-plus-replacement-battery');
   });

   test('Current item from cross-sell can be added to cart', async ({
      page,
   }) => {
      const products = await page.getByTestId('cross-sell-item');

      let currentProductTitle = null;
      let currentProductPrice = null;
      const otherProductTitles = [];

      for (const product of await products.all()) {
         const isCurrent = await product
            .locator('span', { hasText: 'Current item' })
            .isVisible();
         if (isCurrent) {
            currentProductPrice = await product
               .getByTestId('product-price')
               .textContent();
            await expect(currentProductPrice).toMatch(/^\$[0-9]+(\.[0-9]{2})/);
            currentProductTitle = await product
               .getByTestId('cross-sell-item-title')
               .textContent();
            continue;
         }

         // Deselect other cross-sell products
         otherProductTitles.push(
            await product.getByTestId('cross-sell-item-title').textContent()
         );
         await product.getByTestId('cross-sell-item-select').click();
      }

      // Assert total price matches price of product as it's the only one selected
      await expect(
         page.getByText('Total Price: ' + currentProductPrice)
      ).toBeVisible();

      // Assert adding to cart only adds current product
      await page.getByTestId('cross-sell-add-to-cart-button').click();

      const cartDrawerText = await page
         .getByTestId('cart-drawer-body')
         .textContent();

      otherProductTitles.forEach((otherProductTitle) => {
         expect(cartDrawerText).not.toContain(otherProductTitle);
      });
      expect(cartDrawerText).toContain(currentProductTitle);
   });

   test('Cross-sell products can be added to cart', async ({ page }) => {
      const products = await page.getByTestId('cross-sell-item');

      const allProductTitles = [];
      let expectedTotalPrice = 0;

      for (const product of await products.all()) {
         allProductTitles.push(
            await product.getByTestId('cross-sell-item-title').textContent()
         );
         const productPrice = await product
            .getByTestId('product-price')
            .textContent();
         expectedTotalPrice += parseFloat(productPrice!.slice(1));
      }

      // Assert total price matches the sum of all products
      await expect(
         page.getByText('Total Price: $' + expectedTotalPrice.toFixed(2))
      ).toBeVisible();

      // Assert adding to cart adds all products
      await page.getByTestId('cross-sell-add-to-cart-button').click();

      const cartDrawerText = await page
         .getByTestId('cart-drawer-body')
         .textContent();

      allProductTitles.forEach((productTitle) => {
         expect(cartDrawerText).toContain(productTitle);
      });
   });
});
