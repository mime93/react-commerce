import { pluralize } from '@helpers/application-helpers';
import { classNames } from '@helpers/tailwind-helpers';
import type { ProductSearchHit } from '@models/product-list';
import { Wrapper } from 'app/(defaultLayout)/components/wrapper';
import { CurrentRefinements } from './current-refinements';
import { FacetFilter } from './facet-filter';
import { SearchForm } from './search-form';
import { SearchInput } from './search-input';

interface FilterableProductsSectionProps {
   products: ProductSearchHit[];
   query: string;
   facets?: Record<string, FacetValueCounts>;
   refinements?: Record<string, string[]>;
   hitsCount: number;
}

type FacetValueCounts = Record<string, number>;

export function FilterableProductsSection({
   products,
   query,
   facets,
   refinements = {},
   hitsCount,
}: FilterableProductsSectionProps) {
   return (
      <section className="my-4">
         <Wrapper>
            <SearchForm>
               <div className="flex w-full space-x-5">
                  {facets && (
                     <FacetsCard>
                        <CurrentRefinements refinements={refinements} />
                        <ul className="divide-y space-y-4">
                           {Object.entries(facets).map(
                              ([facetName, facetValues]) => {
                                 return (
                                    <FacetFilter
                                       key={facetName}
                                       facetName={facetName}
                                       facetValues={facetValues}
                                       selectedValues={refinements?.[facetName]}
                                    />
                                 );
                              }
                           )}
                        </ul>
                     </FacetsCard>
                  )}
                  <div className="flex-grow space-y-2">
                     <div className="flex items-center justify-between">
                        <div className="text-gray-500 font-medium">
                           {hitsCount}{' '}
                           {pluralize(hitsCount, 'result', 'results')}
                        </div>
                        <SearchInput
                           placeholder="Search products"
                           defaultValue={query}
                        />
                     </div>
                     <div className="bg-white border border-gray-300 rounded">
                        <ul>
                           {products.map((product) => {
                              return (
                                 <li key={product.objectID} className="h-24">
                                    <h2>{product.title}</h2>
                                 </li>
                              );
                           })}
                        </ul>
                     </div>
                  </div>
               </div>
            </SearchForm>
         </Wrapper>
      </section>
   );
}

function FacetsCard({ children }: React.PropsWithChildren<{}>) {
   return (
      <div
         className={classNames(
            'bg-white border border-gray-300 rounded p-3 w-64',
            'sticky top-4 max-h-[calc(100vh-2*theme(spacing.4))] overflow-scroll',
            'divide-y'
         )}
      >
         {children}
      </div>
   );
}
