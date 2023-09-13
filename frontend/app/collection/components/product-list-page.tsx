// import { notFound } from 'next/navigation';
import { FilterableProductsSection } from './sections/filterable-products-section';
// import { HeroSection } from './sections/hero-section';
// import { getProductList } from './queries/get-product-list';
import {
   ProductListPageSearchParams,
   ProductListType,
   searchProducts,
} from '../queries/search-products';

interface ProductListPageProps {
   type: ProductListType;
   handle: string;
   searchParams: ProductListPageSearchParams;
}

export default async function ProductListPage({
   type,
   searchParams,
}: ProductListPageProps) {
   // const productList = await getProductList(handle);

   // if (productList == null) {
   //    return notFound();
   // }

   const { hits, hitsCount, facets, currentRefinements } = await searchProducts(
      {
         productListType: type,
         searchParams,
      }
   );

   return (
      <div>
         <FilterableProductsSection
            products={hits}
            query={currentRefinements.query}
            facets={facets}
            refinements={currentRefinements.facets}
            hitsCount={hitsCount}
         />
      </div>
   );

   // return (
   //    <>
   //       <div>
   //          {productList.sections.map((section) => {
   //             switch (section.type) {
   //                case 'Hero': {
   //                   return (
   //                      <HeroSection
   //                         key={section.id}
   //                         title={productList.h1 ?? productList.title}
   //                         tagline={productList.tagline}
   //                         description={productList.description}
   //                         backgroundImage={productList.heroImage}
   //                         brandLogo={productList.brandLogo}
   //                         productListPage={searchState.page}
   //                      />
   //                   );
   //                }
   //                case 'FilterableProducts': {
   //                   return (
   //                      <FilterableProductsSection
   //                         key={section.id}
   //                         products={searchResponse.hits}
   //                         searchState={searchState}
   //                      />
   //                   );
   //                }
   //                default: {
   //                   return null;
   //                }
   //             }
   //          })}
   //       </div>
   //    </>
   // );
}
