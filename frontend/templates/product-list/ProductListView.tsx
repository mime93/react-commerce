import { VStack } from '@chakra-ui/react';
import { LifetimeWarrantySection } from '@components/sections/LifetimeWarrantySection';
import { computeProductListAlgoliaFilterPreset } from '@helpers/product-list-helpers';
import type { ProductList } from '@models/product-list';
import { Configure, useMenu } from 'react-instantsearch-hooks-web';
import { useItemTypeProductList } from './hooks/useItemTypeProductList';
import { MetaTags } from './MetaTags';
import { SecondaryNavigation } from './SecondaryNavigation';
import {
   FeaturedProductListsSection,
   FilterableProductsSection,
   HeroSection,
   ProductListChildrenSection,
   RelatedPostsSection,
} from './sections';

const HITS_PER_PAGE = 24;

export interface ProductListViewProps {
   productList: ProductList;
   algoliaSSR?: boolean;
}

export function ProductListView({
   productList,
   algoliaSSR,
}: ProductListViewProps) {
   // This temporary hack allows to correctly populate the itemType facet during SSR
   // see: https://github.com/algolia/instantsearch/issues/5571
   const _ = useMenu({ attribute: 'facet_tags.Item Type' });
   const filters = computeProductListAlgoliaFilterPreset(productList);

   const itemTypeProductList = useItemTypeProductList(productList);

   const currentProductList = itemTypeProductList ?? productList;

   if (algoliaSSR) {
      return (
         <>
            <Configure
               filters={filters}
               hitsPerPage={HITS_PER_PAGE}
               facetingAfterDistinct
            />
            <FilterableProductsSection
               productList={currentProductList}
               algoliaSSR={algoliaSSR}
            />
         </>
      );
   }

   return (
      <>
         <Configure
            filters={filters}
            hitsPerPage={HITS_PER_PAGE}
            facetingAfterDistinct
         />
         <MetaTags productList={currentProductList} />
         <SecondaryNavigation productList={productList} />
         <VStack
            align="stretch"
            spacing={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
         >
            <HeroSection
               title={currentProductList.h1 ?? currentProductList.title}
               tagline={currentProductList.tagline}
               description={currentProductList.description}
               backgroundImage={currentProductList.heroImage}
               brandLogo={currentProductList.brandLogo}
            />
            {currentProductList.children.length > 0 && (
               <ProductListChildrenSection productList={productList} />
            )}
            <FilterableProductsSection productList={productList} />
            {currentProductList.sections.map((section, index) => {
               switch (section.type) {
                  case 'LifetimeWarranty': {
                     return (
                        <LifetimeWarrantySection
                           key={index}
                           variant="banner"
                           title={section.title}
                           description={section.description}
                           callToAction={section.callToAction}
                        />
                     );
                  }
                  case 'RelatedPosts': {
                     const tags = [productList.title].concat(
                        section.tags?.split(',').map((tag) => tag.trim()) || []
                     );
                     return <RelatedPostsSection key={index} tags={tags} />;
                  }
                  case 'FeaturedProductLists': {
                     const { title, productLists } = section;
                     if (productLists.length > 0) {
                        return (
                           <FeaturedProductListsSection
                              key={index}
                              title={title}
                              productLists={productLists}
                           />
                        );
                     }
                     return null;
                  }
                  default: {
                     console.warn(
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        `Section ${section.__typename} not implemented`
                     );
                     return null;
                  }
               }
            })}
         </VStack>
      </>
   );
}
