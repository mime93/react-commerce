import ProductListPage from '../components/product-list-page';
import type { ProductListPageSearchParams } from '../queries/search-products';

interface PartsPageProps {
   searchParams: ProductListPageSearchParams;
}
export default function PartsPage({ searchParams }: PartsPageProps) {
   return (
      <ProductListPage
         type="parts"
         handle="Parts"
         searchParams={searchParams}
      />
   );
}
