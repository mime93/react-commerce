import { Box } from '@chakra-ui/react';
import { PageBreadcrumb } from '@components/common';
import { flags } from '@config/flags';
import { noindexDevDomains } from '@helpers/next-helpers';
import { invariant } from '@ifixit/helpers';
import { DefaultLayout, getLayoutServerSideProps } from '@layouts/default';
import { findProduct } from '@models/product';
import { GetServerSideProps } from 'next';
import { SecondaryNavigation } from './component/SecondaryNavigation';
import {
   ProductTemplateProps,
   useProductTemplateProps,
} from './hooks/useProductTemplateProps';
import { useSelectedVariant } from './hooks/useSelectedVariant';
import { CompatibilitySection } from './sections/CompatibilitySection';
import { CrossSellSection } from './sections/CrossSellSection';
import { FeaturedProductsSection } from './sections/FeaturedProductsSection';
import { LifetimeWarrantySection } from './sections/LifetimeWarrantySection';
import { ProductSection } from './sections/ProductSection';
import { ReplacementGuidesSection } from './sections/ReplacementGuidesSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { ServiceValuePropositionSection } from './sections/ServiceValuePropositionSection';

export const ProductTemplate: NextPageWithLayout<ProductTemplateProps> = () => {
   const { product } = useProductTemplateProps();
   const [selectedVariant, setSelectedVariantId] = useSelectedVariant(product);

   return (
      <>
         {product.breadcrumbs != null && (
            <SecondaryNavigation zIndex="10">
               <PageBreadcrumb items={product.breadcrumbs} />
            </SecondaryNavigation>
         )}
         <Box pt="6">
            <ProductSection
               product={product}
               selectedVariant={selectedVariant}
               onVariantChange={setSelectedVariantId}
            />
            <ReplacementGuidesSection product={product} />
            <ServiceValuePropositionSection />
            <CrossSellSection
               product={product}
               selectedVariant={selectedVariant}
            />
            <ReviewsSection
               product={product}
               selectedVariant={selectedVariant}
            />
            <CompatibilitySection compatibility={product.compatibility} />
            <FeaturedProductsSection product={product} />
            <LifetimeWarrantySection variant={selectedVariant} />
         </Box>
      </>
   );
};

ProductTemplate.getLayout = function getLayout(page, pageProps) {
   return <DefaultLayout {...pageProps.layoutProps}>{page}</DefaultLayout>;
};

export const getServerSideProps: GetServerSideProps<ProductTemplateProps> =
   async (context) => {
      noindexDevDomains(context);
      // @TODO: Remove this before the page goes live
      context.res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      const { handle } = context.params || {};
      invariant(typeof handle === 'string', 'handle param is missing');
      const layoutProps = await getLayoutServerSideProps();
      const product = await findProduct(
         {
            shopDomain: layoutProps.currentStore.shopify.storefrontDomain,
            accessToken: layoutProps.currentStore.shopify.storefrontAccessToken,
         },
         handle
      );
      if (product == null) {
         return {
            notFound: true,
         };
      }
      const pageProps: ProductTemplateProps = {
         layoutProps,
         appProps: {},
         product,
      };
      return {
         props: pageProps,
      };
   };
