import { CACHE_DISABLED, DEFAULT_STORE_CODE } from '@config/env';
import Product from '@pages/api/nextjs/cache/product';
import { ProductTemplate } from '@templates/product';
import { notFound, redirect } from 'next/navigation';

interface ProductPageProps {
   params: {
      handle: string;
   };
   searchParams: {
      disableCacheGets?: string | string[] | undefined;
   };
}

export default async function ProductPage({
   params,
   searchParams,
}: ProductPageProps) {
   const skipCache = shouldSkipCache(searchParams);
   const data = await Product.get(
      { handle: params.handle, storeCode: DEFAULT_STORE_CODE },
      { forceMiss: skipCache }
   );
   if (data == null) {
      notFound();
   }
   if (data.__typename === 'ProductRedirect') {
      redirect(data.target);
   }
   return <ProductTemplate product={data} />;
}

function shouldSkipCache(
   searchParams: Record<string, string | string[] | undefined>
) {
   return searchParams.disableCacheGets != null || CACHE_DISABLED;
}
