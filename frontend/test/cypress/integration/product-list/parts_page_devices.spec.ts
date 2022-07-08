describe('parts page devices', () => {
   const user = cy;

   beforeEach(() => {
      user.visit('/Parts');
   });

   it('should navigate until the last device page', () => {
      assertVisibleFilterAndProducts();
      assertAvailableProducts();

      user.get('body').then(($body) => {
         const device = $body.find('a[href="/Parts/Mac"]');
         if (!device.is(':visible')) {
            user.get('button').contains('Show more').click();
         }
         device[0].click();
      });

      user
         .location('pathname', { timeout: 20000 })
         .should('include', '/Parts/Mac');
      user.get('h1').contains('Mac Parts').should('be.visible');

      navigateUntilLastDevice();
      assertVisibleFilterAndProducts();
      assertAvailableProducts();
   });

   function assertVisibleFilterAndProducts() {
      user.getByDataTestId('filterable-products-section').should('be.visible');
      user
         .getByDataTestId('facets-accordion')
         .scrollIntoView()
         .should('be.visible');
   }

   // Makes sure there is at least 1 product available
   function assertAvailableProducts() {
      user
         .getByDataTestId('list-view-products')
         .children('article')
         .its('length')
         .should('be.gte', 1);
   }

   // Recursively navigate to the first device until no sub-devices are left
   function navigateUntilLastDevice() {
      user.get('body').then(($body) => {
         if ($body.find('[data-testid="product-list-devices"]').length <= 0)
            return false;

         user
            .getByDataTestId('product-list-devices')
            .find('a')
            .first()
            .as('device')
            .click();

         user
            .get('@device')
            .should('have.attr', 'href')
            .then((href) => {
               user
                  .location('pathname', { timeout: 20000 })
                  .should('include', href);
            });
         assertVisibleFilterAndProducts();
         navigateUntilLastDevice();
      });
   }
});

export {};
