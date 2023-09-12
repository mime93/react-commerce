import ProductListPage from '../../components/product-list-page';

export default function DevicePartsPage({
   params,
}: {
   params: { handle: string };
}) {
   return <ProductListPage handle={params.handle} />;
}
