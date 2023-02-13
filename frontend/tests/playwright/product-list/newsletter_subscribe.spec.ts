import { test, expect } from '../test-fixtures';

test.describe('Subscribe to newsletter', () => {
   test.beforeEach(async ({ page }) => {
      await page.goto('/Parts');
   });

   test('Requires an email', async ({ page }) => {
      const footerNewsletterForm = page.getByTestId('footer-newsletter-form');

      await expect(
         footerNewsletterForm.getByText(/please insert a valid email/i)
      ).not.toBeVisible();

      await footerNewsletterForm
         .getByRole('button', { name: /subscribe|join/i })
         .click();

      await expect(
         footerNewsletterForm.getByText(/please insert a valid email/i)
      ).toBeVisible();
   });

   test('Prevents invalid email', async ({ page }) => {
      await expect(
         page.getByText(/please insert a valid email/i)
      ).not.toBeVisible();

      await page.getByTestId('newsletter-email-input').fill('test@example');
      await page.getByRole('button', { name: /subscribe|join/i }).click();
      await expect(
         page.getByText(/please insert a valid email/i)
      ).toBeVisible();
   });

   test('Shows confirmation when email is subscribed', async ({
      page,
      clientRequestHandler,
      rest,
   }) => {
      clientRequestHandler.use(
         rest.post('/api/2.0/cart/newsletter/subscribe', (req, res, ctx) => {
            return res(ctx.status(200));
         })
      );

      await page.getByTestId('newsletter-email-input').fill('test@example.com');
      await page.getByRole('button', { name: /subscribe|join/i }).click();
      await expect(page.getByText('Subscribed!')).toBeVisible();
      await expect(
         page.getByTestId('footer-newsletter-subscribe-button')
      ).not.toBeVisible();
      await expect(
         page.getByText(/please insert a valid email/i)
      ).not.toBeVisible();
   });

   test('Shows an error when server request fails', async ({
      page,
      clientRequestHandler,
      rest,
   }) => {
      clientRequestHandler.use(
         rest.post('/api/2.0/cart/newsletter/subscribe', (req, res, ctx) => {
            return res(ctx.status(500));
         })
      );

      await page.getByTestId('newsletter-email-input').fill('test@example.com');

      await page.getByRole('button', { name: /subscribe|join/i }).click();

      await expect(
         page.getByText(/error trying to subscribe to newsletter/i)
      ).toBeVisible();
   });
});
