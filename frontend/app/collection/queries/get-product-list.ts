import { getiFixitOriginFromHost } from '@helpers/path-helpers';
import ProductListCache from '@pages/api/nextjs/cache/product-list';
import { headers } from 'next/headers';
import { cache } from 'react';

export const revalidate = 3600;

export const getProductList = cache(async (handle: string) => {
   const headerList = headers();
   const ifixitOrigin = getiFixitOriginFromHost(headerList);
   const productList = await ProductListCache.get(
      { filters: { handle: { eq: handle } }, ifixitOrigin },
      {}
   );

   return productList;
});
