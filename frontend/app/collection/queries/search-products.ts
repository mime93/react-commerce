import {
   ALGOLIA_API_KEY,
   ALGOLIA_APP_ID,
   ALGOLIA_PRODUCT_INDEX_NAME,
} from '@config/env';
import type { ProductSearchHit } from '@models/product-list';
import algoliasearch from 'algoliasearch';
import map from 'lodash/map';

const SUPPORTED_FACETS = [
   'facet_tags.Capacity',
   'facet_tags.Device Brand',
   'facet_tags.Device Category',
   'facet_tags.Device Type',
   'facet_tags.Item Type',
   'facet_tags.OS',
   'facet_tags.Part or Kit',
   'facet_tags.Tool Category',
   'device',
   'worksin',
];

const HITS_PER_PAGE = 24;

interface SearchProductsOptions {
   productListType: ProductListType;
   searchParams: ProductListPageSearchParams;
}

export type ProductListType =
   | 'parts'
   | 'tools'
   | 'device-parts'
   | 'tools-category'
   | 'marketing';

export async function searchProducts({
   searchParams,
   productListType,
}: SearchProductsOptions) {
   const { query, page, refinements } = parseSearchParams(searchParams);
   const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
   const index = client.initIndex(ALGOLIA_PRODUCT_INDEX_NAME);

   const baseFilters = createFilters({
      productListType,
   });
   const facetFilters = createFacetFilters(refinements);

   const result = await index.search<ProductSearchHit>(query, {
      filters: baseFilters,
      facetFilters,
      facetingAfterDistinct: true,
      facets: SUPPORTED_FACETS,
      hitsPerPage: HITS_PER_PAGE,
   });

   return {
      hits: result.hits,
      hitsCount: result.nbHits,
      facets: result.facets,
      page,
      currentRefinements: {
         query,
         facets: refinements,
      },
   };
}

function createFacetFilters(refinements: Record<string, string[]>) {
   return map(refinements, (values, facet) => {
      return values.map((value) => `${facet}:${value}`);
   });
}

export interface ProductListPageSearchParams {
   p?: string;
   q?: string;
   [key: string]: string | string[] | undefined;
}

function parseSearchParams(searchParams: ProductListPageSearchParams) {
   const page = searchParams.p ? parseInt(searchParams.p) : 1;
   const query = searchParams.q ?? '';
   const refinements: Record<string, string[]> = {};

   SUPPORTED_FACETS.forEach((facet) => {
      const filterValues = searchParams[facet];
      if (filterValues) {
         refinements[facet] = Array.isArray(filterValues)
            ? filterValues
            : [filterValues];
      }
   });

   return { page, query, refinements };
}

const PUBLIC_FILTERS = 'public=1 AND is_pro!=1';

function createFilters({
   productListType,
}: {
   productListType: ProductListType;
}) {
   const filters: string[] = [];

   filters.push(PUBLIC_FILTERS);

   switch (productListType) {
      case 'parts':
         filters.push("'facet_tags.Main Category': 'Parts'");
         break;
      case 'tools':
         filters.push("'facet_tags.Main Category': 'Tools'");
         break;
   }
   return filters.join(' AND ');
}
