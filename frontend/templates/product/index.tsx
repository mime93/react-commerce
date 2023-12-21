import { Box, Flex } from '@chakra-ui/react';
import { PageEditMenu } from '@components/admin';
import { PageBreadcrumb } from '@components/common';
import { BannersSection } from '@components/sections/BannersSection';
import { BitTableSection } from '@components/sections/BitTableSection';
import { FAQsSection } from '@components/sections/FAQsSection';
import { FeaturedProductsSection } from '@components/sections/FeaturedProductsSection';
import { QuoteSection } from '@components/sections/QuoteSection';
import { ReplacementGuidesSection } from '@components/sections/ReplacementGuidesSection';
import { ServiceValuePropositionSection } from '@components/sections/ServiceValuePropositionSection';
import { SplitWithImageContentSection } from '@components/sections/SplitWithImageSection';
import { DEFAULT_STORE_CODE } from '@config/env';
import { trackInAnalyticsViewItem } from '@ifixit/analytics';
import { trackInPiwik } from '@ifixit/analytics/piwik/track-event';
import { useAuthenticatedUser } from '@ifixit/auth-sdk';
import {
   assertNever,
   getVariantIdFromVariantURI,
   isLifetimeWarranty,
} from '@ifixit/helpers';
import { ProductPreview } from '@models/components/product-preview';
import type { Product } from '@pages/api/nextjs/cache/product';
import { useInternationalBuyBox } from '@templates/product/hooks/useInternationalBuyBox';
import * as React from 'react';
import { LifetimeWarrantySection } from '../../components/sections/LifetimeWarrantySection';
import { MetaTags } from './MetaTags';
import { ProductPixelPing } from './components/PixelPing';
import { SecondaryNavigation } from './components/SecondaryNavigation';
import { useIsProductForSale } from './hooks/useIsProductForSale';
import { useProductPageAdminLinks } from './hooks/useProductPageAdminLinks';
import { useSelectedVariant } from './hooks/useSelectedVariant';
import { CompatibilityNotesSection } from './sections/CompatibilityNotesSection';
import { CompatibilitySection } from './sections/CompatibilitySection';
import { ProductOverviewSection } from './sections/ProductOverviewSection';
import { ProductReviewsSection } from './sections/ProductReviewsSection';

interface ProductTemplateProps {
   product: Product;
}

export function ProductTemplate({ product }: ProductTemplateProps) {
   const [selectedVariant, setSelectedVariantId] = useSelectedVariant(product);

   const internationalBuyBox = useInternationalBuyBox(product);

   const isProductForSale = useIsProductForSale(product);
   const isAdminUser = useAuthenticatedUser().data?.isAdmin ?? false;

   React.useEffect(() => {
      trackInAnalyticsViewItem({
         currency: selectedVariant.price.currencyCode,
         value: selectedVariant.price.amount,
         items: [
            {
               item_id: selectedVariant.sku,
               item_name: selectedVariant.internalDisplayName,
               item_variant: getVariantIdFromVariantURI(selectedVariant.id),
               price: selectedVariant.price.amount,
               quantity: selectedVariant.quantityAvailable,
            },
         ],
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const trackFeaturedProductClick = React.useCallback(
      (product: ProductPreview) => {
         trackInPiwik({
            eventCategory: 'Featured Products - Product Page',
            eventAction: `Featured on Product Page - ${product.handle}`,
            eventName: `${window.location.origin}${window.location.pathname}`,
         });
      },
      []
   );

   const adminLinks = useProductPageAdminLinks({
      product,
      storeCode: DEFAULT_STORE_CODE,
   });

   return (
      <React.Fragment key={product.handle}>
         <MetaTags product={product} selectedVariant={selectedVariant} />
         {isAdminUser && (
            <SecondaryNavigation
               display={{ lg: 'none' }}
               bg="white"
               borderBottomWidth="thin"
            >
               <Flex w="full" direction="row-reverse">
                  <PageEditMenu links={adminLinks} />
               </Flex>
            </SecondaryNavigation>
         )}
         {product.breadcrumbs != null && (
            <SecondaryNavigation>
               <Flex w="full" justify="space-between">
                  <PageBreadcrumb items={product.breadcrumbs} w="full" />
                  {isAdminUser && (
                     <PageEditMenu
                        links={adminLinks}
                        display={{
                           base: 'none',
                           lg: 'block',
                        }}
                     />
                  )}
               </Flex>
            </SecondaryNavigation>
         )}
         <Box>
            {product.sections.map((section) => {
               switch (section.type) {
                  case 'ProductOverview':
                     return (
                        <ProductOverviewSection
                           key={section.id}
                           product={product}
                           selectedVariant={selectedVariant}
                           onVariantChange={setSelectedVariantId}
                           internationalBuyBox={internationalBuyBox}
                        />
                     );
                  case 'ReplacementGuides':
                     return (
                        <ReplacementGuidesSection
                           key={section.id}
                           id={section.id}
                           title={section.title}
                           guides={section.guides}
                        />
                     );
                  case 'SplitWithImage':
                     return (
                        <SplitWithImageContentSection
                           key={section.id}
                           id={section.id}
                           title={section.title}
                           label={section.label}
                           description={section.description}
                           image={section.image}
                           imagePosition={section.imagePosition}
                           callToAction={section.callToAction}
                        />
                     );
                  case 'ServiceValueProposition': {
                     if (!product.isEnabled) return null;

                     return (
                        <ServiceValuePropositionSection
                           key={section.id}
                           id={section.id}
                        />
                     );
                  }
                  case 'ProductReviews': {
                     if (!isProductForSale) return null;

                     return (
                        <ProductReviewsSection
                           key={section.id}
                           title={section.title}
                           product={product}
                           selectedVariant={selectedVariant}
                        />
                     );
                  }
                  case 'DeviceCompatibility':
                     return product.compatibilityNotes?.length ? (
                        <CompatibilityNotesSection
                           key={section.id}
                           compatibilityNotes={product.compatibilityNotes}
                        />
                     ) : (
                        <CompatibilitySection
                           key={section.id}
                           compatibility={product.compatibility}
                        />
                     );
                  case 'FeaturedProducts': {
                     return (
                        <FeaturedProductsSection
                           key={section.id}
                           id={section.id}
                           title={section.title}
                           description={section.description}
                           background={section.background}
                           products={section.products}
                           onProductClick={trackFeaturedProductClick}
                        />
                     );
                  }
                  case 'LifetimeWarranty': {
                     if (!isLifetimeWarranty(selectedVariant.warranty))
                        return null;

                     return (
                        <LifetimeWarrantySection
                           key={section.id}
                           title={section.title}
                           description={section.description}
                        />
                     );
                  }
                  case 'Banners': {
                     return (
                        <BannersSection
                           key={section.id}
                           id={section.id}
                           banners={section.banners}
                        />
                     );
                  }
                  case 'Quote': {
                     return (
                        <QuoteSection
                           key={section.id}
                           id={section.id}
                           quote={section.text}
                           author={section.author}
                           image={section.image}
                        />
                     );
                  }
                  case 'FAQs': {
                     return (
                        <FAQsSection
                           key={section.id}
                           id={section.id}
                           title={section.title}
                           description={section.description}
                           faqs={section.faqs}
                        />
                     );
                  }

                  case 'BitTable': {
                     return (
                        <BitTableSection
                           key={section.id}
                           id={section.id}
                           title={section.title}
                           description={section.description}
                           bits={section.bits}
                        />
                     );
                  }

                  default:
                     return assertNever(section);
               }
            })}
         </Box>
         {product.productcode && (
            <ProductPixelPing productcode={parseInt(product.productcode)} />
         )}
      </React.Fragment>
   );
}
