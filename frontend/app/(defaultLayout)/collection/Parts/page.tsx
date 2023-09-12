import ProductListPage from '../components/product-list-page';
import {
   ProductListPageSearchParams,
   getProductListState,
} from '../helpers/search-params-helpers';

interface PartsPageProps {
   searchParams: ProductListPageSearchParams;
}
export default function PartsPage({ searchParams }: PartsPageProps) {
   const productListState = getProductListState(searchParams);
   return <ProductListPage handle="Parts" page={productListState.page} />;
}
