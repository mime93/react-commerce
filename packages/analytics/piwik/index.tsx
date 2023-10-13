import { CartLineItem } from '@ifixit/cart-sdk';
import {
   Money,
   getShopifyStoreDomainFromCurrentURL,
   getShopifyLanguageFromCurrentURL,
   sumMoney,
} from '@ifixit/helpers';
import { piwikPush } from './piwikPush';

/**
 * @see https://developer.matomo.org/api-reference/tracking-javascript
 */
export function trackPiwikPageView(url: string) {
   piwikPush(['setCustomUrl', url]);
   piwikPush(['setDocumentTitle', document.title]);
   piwikPush(['trackPageView']);
}

export function trackPiwikPreferredStore(piwikEnv: string | undefined): void {
   const customDimensions = getPiwikCustomDimensionsForEnv(piwikEnv);
   if (typeof window !== 'undefined' && customDimensions) {
      const host = getShopifyStoreDomainFromCurrentURL();
      piwikPush([
         'setCustomDimension',
         customDimensions['preferredStore'],
         host,
      ]);
   }
}

export function trackPiwikPreferredLanguage(
   piwikEnv: string | undefined
): void {
   const customDimensions = getPiwikCustomDimensionsForEnv(piwikEnv);
   if (typeof window !== 'undefined' && customDimensions) {
      const lang = getShopifyLanguageFromCurrentURL();
      piwikPush([
         'setCustomDimension',
         customDimensions['preferredLanguage'],
         lang,
      ]);
   }
}

/**
 * @see https://developer.matomo.org/api-reference/tracking-javascript
 * @see https://matomo.org/docs/ecommerce-analytics/#tracking-product-views-in-matomo
 */
type ProductData = {
   productSku: string;
   productName?: string;
   /**
    * Category name, or up to five unique categories, e.g. ["Books", "New
    * Releases", "Technology"]
    */
   categoryName?: string | [string, string?, string?, string?, string?];
   price: Money;
};

export function trackPiwikEcommerceView(product: ProductData) {
   piwikPush([
      'setEcommerceView',
      product.productSku,
      product.productName,
      product.categoryName,
      product.price.amount,
   ]);
}

export function trackPiwikCartChange(items: CartLineItem[]) {
   trackClearCart();
   if (items.length === 0) {
      return;
   }
   items.forEach((item) => {
      trackAddToCart({
         productSku: item.itemcode,
         productName: item.internalDisplayName,
         price: item.price,
         quantity: item.quantity,
      });
   });

   const totalPrice = sumMoney(items.map((i) => i.price));
   trackCartUpdated(totalPrice);
}

/**
 * @see https://developer.matomo.org/api-reference/tracking-javascript
 * @see https://matomo.org/docs/ecommerce-analytics/#example-of-adding-a-product-to-the-order
 */
type AddToCartData = {
   productSku: string;
   productName?: string;
   /**
    * Category name, or up to five unique categories, e.g. ["Books", "New
    * Releases", "Technology"]
    */
   categoryName?: string | [string, string?, string?, string?, string?];
   price?: Money;
   /**
    * How many of this item to add (Defaults to 1)
    */
   quantity?: number;
};

/**
 * @see https://developer.matomo.org/api-reference/tracking-javascript
 * @see https://matomo.org/docs/ecommerce-analytics/#example-of-adding-a-product-to-the-order
 */
function trackAddToCart(product: AddToCartData) {
   piwikPush([
      'addEcommerceItem',
      product.productSku,
      product.productName,
      product.categoryName,
      product.price?.amount,
      product.quantity,
   ]);
}

function trackClearCart() {
   piwikPush(['clearEcommerceCart']);
}

function trackCartUpdated(grandTotal: Money) {
   piwikPush(['trackEcommerceCartUpdate', grandTotal.amount]);
}

type PiwikCustomDimensions = {
   preferredStore: number;
   preferredLanguage: number;
};

function getPiwikCustomDimensionsForEnv(
   env: string | undefined
): PiwikCustomDimensions | null {
   switch (env) {
      case 'prod':
         return {
            preferredStore: 1,
            preferredLanguage: 2,
         };
      case 'dev':
         return {
            preferredStore: 1,
            preferredLanguage: 2,
         };
      default:
         return null;
   }
}
