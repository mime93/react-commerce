import { DEFAULT_STORE_CODE } from '@config/env';
import { hasDisableCacheGets } from '@helpers/cache-control-helpers';
import { ifixitOriginFromHost } from '@helpers/path-helpers';
import { invariant } from '@ifixit/helpers';
import { urlFromContext } from '@ifixit/helpers/nextjs';
import { getLayoutServerSideProps } from '@layouts/default/server';
import Product from '@pages/api/nextjs/cache/product';
import { GetServerSideProps } from 'next';
import { ProductTemplateProps } from './hooks/useProductTemplateProps';

export const getServerSideProps: GetServerSideProps<
   ProductTemplateProps
> = async (context) => {
   const { handle } = context.params || {};
   invariant(typeof handle === 'string', 'handle param is missing');
   const forceMiss = hasDisableCacheGets(context);
   const { stores, ...otherLayoutProps } = await getLayoutServerSideProps({
      storeCode: DEFAULT_STORE_CODE,
      forceMiss,
   });
   const ifixitOrigin = ifixitOriginFromHost(context);
   const product = await Product.get(
      {
         handle,
         storeCode: DEFAULT_STORE_CODE,
         ifixitOrigin,
      },
      { forceMiss }
   );

   if (product?.__typename === 'ShopifyProductRedirect') {
      return {
         redirect: {
            destination: product.target,
            permanent: true,
         },
      };
   }

   if (product == null) {
      return {
         notFound: true,
      };
   }

   if (product.redirectUrl) {
      const destination = new URL(product.redirectUrl);
      const requestParams = new URL(urlFromContext(context)).searchParams;
      requestParams.forEach((value, key) => {
         if (!destination.searchParams.has(key)) {
            destination.searchParams.append(key, value);
         }
      });
      return {
         redirect: {
            destination: destination.href,
            permanent: true,
         },
      };
   }

   const proOnly = product?.tags.find((tag: string) => tag === 'Pro Only');
   if (proOnly) {
      context.res.setHeader('X-Robots-Tag', 'noindex, follow');
   }

   const codeToDomain =
      product.enabledDomains?.reduce((acc, { code, domain }) => {
         acc[code] = domain;
         return acc;
      }, {} as Record<string, string>) ?? {};
   const storesWithProductUrls = stores.map((store) => {
      const domain =
         store.code === DEFAULT_STORE_CODE
            ? new URL(store.url).origin
            : codeToDomain[store.code];
      if (domain) {
         return { ...store, url: `${domain}/products/${product.handle}` };
      }
      return store;
   });

   const pageProps: ProductTemplateProps = {
      layoutProps: {
         ...otherLayoutProps,
         stores: storesWithProductUrls,
      },
      appProps: {
         ifixitOrigin: ifixitOrigin,
      },
      product,
   };
   return {
      props: pageProps,
   };
};
