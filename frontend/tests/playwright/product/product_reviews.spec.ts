import { test, expect } from '@playwright/test';

test.describe('Product Page Reviews test', () => {
   test('see more reviews button displays more reviews', async ({ page }) => {
      await page.goto('products/repair-business-toolkit');

      const reviewsCountBefore = await page
         .getByTestId('product-review-line-item')
         .count();

      await page.getByText('see more reviews').click();

      const reviewsAfter = page.getByTestId('product-review-line-item');
      const reviewsCountAfter = await reviewsAfter.count();
      expect(reviewsCountAfter).toBeGreaterThan(reviewsCountBefore);

      for (let i = 0; i < reviewsCountAfter; i++) {
         await expect(reviewsAfter.nth(i)).toBeVisible();
      }
   });
});
