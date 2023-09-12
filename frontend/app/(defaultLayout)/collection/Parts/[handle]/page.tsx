import ProductListPage from '../../components/product-list-page';
import {
   ProductListPageSearchParams,
   getProductListState,
} from '../../helpers/search-params-helpers';

interface DevicePartsPageProps {
   params: { handle: string };
   searchParams: ProductListPageSearchParams;
}

export default function DevicePartsPage({
   params,
   searchParams,
}: DevicePartsPageProps) {
   const productListState = getProductListState(searchParams);
   return (
      <ProductListPage handle={params.handle} page={productListState.page} />
   );
}
