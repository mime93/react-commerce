export interface ProductListPageSearchParams {
   p?: string;
}

export function getProductListState(searchParams: ProductListPageSearchParams) {
   const page = searchParams.p ? parseInt(searchParams.p) : 1;
   return { page };
}
