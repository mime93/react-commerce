import type { ProductListPageSearchParams } from '../../queries/search-products';
import ProductListPage from '../../components/product-list-page';

interface DevicePartsPageProps {
   params: { handle: string };
   searchParams: ProductListPageSearchParams;
}

export default function DevicePartsPage({
   params,
   searchParams,
}: DevicePartsPageProps) {
   return (
      <ProductListPage
         type="device-parts"
         handle={params.handle}
         searchParams={searchParams}
      />
   );
}
