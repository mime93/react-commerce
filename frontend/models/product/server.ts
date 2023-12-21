import { IFIXIT_ORIGIN } from '@config/env';
import { invariant, timeAsync } from '@ifixit/helpers';
import { IFixitAPIClient } from '@ifixit/ifixit-api-client';
import { fetchProductData } from '@lib/ifixit-api/productData';
import {
   FindProductQuery,
   getServerShopifyStorefrontSdk,
} from '@lib/shopify-storefront-sdk';
import { strapi } from '@lib/strapi-sdk';
import { Product, ProductRedirect, getProduct } from '.';
import { findStoreByCode } from '../store';

export type FindProductArgs = {
   handle: string;
   storeCode: string;
};

export async function findProduct({
   handle,
   storeCode,
}: FindProductArgs): Promise<Product | ProductRedirect | null> {
   const store = await findStoreByCode(storeCode);
   const { storefrontDomain, storefrontDelegateAccessToken } = store.shopify;
   invariant(
      storefrontDelegateAccessToken,
      `Storefront delegate access token not found for store "${storeCode}"`
   );
   const storefront = getServerShopifyStorefrontSdk({
      shopDomain: storefrontDomain,
      storefrontDelegateToken: storefrontDelegateAccessToken,
   });
   const [shopifyQueryResponse, strapiQueryResponse, iFixitQueryResponse] =
      await Promise.all([
         timeAsync('shopify_api.findProduct', () =>
            storefront.findProduct({
               handle,
               pathQuery: `path:/products/${handle}`,
            })
         ),
         timeAsync('strapi.findProduct', () =>
            strapi.findProduct({
               handle,
            })
         ),
         fetchProductData(
            new IFixitAPIClient({ origin: IFIXIT_ORIGIN }),
            handle
         ),
      ]);

   const redirect = getRedirect(shopifyQueryResponse);
   const product = await getProduct({
      shopifyProduct: shopifyQueryResponse.product,
      strapiProduct: strapiQueryResponse.products?.data[0],
      iFixitProduct: iFixitQueryResponse,
   });

   return redirect ?? product;
}

function getRedirect(shopifyQuery: FindProductQuery): ProductRedirect | null {
   if (shopifyQuery.product?.redirectUrl?.value != null) {
      return {
         __typename: 'ProductRedirect',
         target: shopifyQuery.product.redirectUrl.value,
      };
   }
   const urlRedirect = shopifyQuery.urlRedirects.edges[0]?.node?.target;

   if (urlRedirect == null) return null;

   return { __typename: 'ProductRedirect', target: urlRedirect };
}
