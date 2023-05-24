import { DEFAULT_STORE_CODE } from '@config/env';
import { ifixitOriginFromHost } from '@helpers/path-helpers';
import { IFixitAPIClient } from '@ifixit/ifixit-api-client';
import { getLayoutServerSideProps } from '@layouts/default/server';
import { GetServerSideProps } from 'next';
import {
   TroubleshootingProps,
   TroubleshootingData,
   TroubleshootingApiData,
   ApiSolutionSection,
   SolutionSection,
} from './hooks/useTroubleshootingProps';
import { Guide } from './hooks/GuideModel';
import Product from '@pages/api/nextjs/cache/product';
import type { Product as ProductType } from '@models/product';
import { hasDisableCacheGets } from '../../helpers/next-helpers';

export const getServerSideProps: GetServerSideProps<
   TroubleshootingProps
> = async (context) => {
   const layoutProps = await getLayoutServerSideProps({
      storeCode: DEFAULT_STORE_CODE,
   });

   const ifixitOrigin = ifixitOriginFromHost(context);
   const client = new IFixitAPIClient({ origin: ifixitOrigin });

   const wikiname = context.params?.wikiname;

   if (!wikiname) {
      return {
         notFound: true,
      };
   }

   async function fetchDataForSolution(
      solution: ApiSolutionSection
   ): Promise<SolutionSection> {
      const guides = await Promise.all(
         solution.guides.map(
            (guideid: number) =>
               client.get(`guides/${guideid}`, 'guide') as Promise<Guide>
         )
      );
      const products: ('' | null | ProductType)[] = await Promise.all(
         solution.products.map(
            (handle: string | null) =>
               handle &&
               Product.get(
                  {
                     handle,
                     storeCode: DEFAULT_STORE_CODE,
                     ifixitOrigin,
                  },
                  { forceMiss: hasDisableCacheGets(context) }
               )
         )
      );
      return {
         ...solution,
         guides,
         products: products.filter((product): product is ProductType =>
            Boolean(product)
         ),
      };
   }

   const troubleshootingData = await client.get<TroubleshootingApiData>(
      `Troubleshooting/${wikiname}`,
      'troubleshooting'
   );

   const solutions: SolutionSection[] = await Promise.all(
      troubleshootingData.solutions.map(fetchDataForSolution)
   );

   const wikiData: TroubleshootingData = {
      ...troubleshootingData,
      solutions,
   };

   const pageProps: TroubleshootingProps = {
      wikiData,
      layoutProps,
      appProps: {
         ifixitOrigin,
      },
   };
   return {
      props: pageProps,
   };
};
