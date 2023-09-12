import { getiFixitOriginFromHost } from '@helpers/path-helpers';
import ProductListCache from '@pages/api/nextjs/cache/product-list';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

async function getProductList(handle: string) {
   const headerList = headers();
   const ifixitOrigin = getiFixitOriginFromHost(headerList);
   console.log('\n\n\nfetch product list..');
   const productList = await ProductListCache.get(
      { filters: { handle: { eq: handle } }, ifixitOrigin },
      {}
   );
   console.log('\n\n\nproduct list: ', productList);

   return productList;
}

interface ProductListPageProps {
   handle: string;
}

export default async function ProductListPage({
   handle,
}: ProductListPageProps) {
   const productList = await getProductList(handle);

   if (productList == null) {
      return notFound();
   }

   return (
      <>
         <div>
            {productList.sections.map((section) => {
               switch (section.type) {
                  case 'Hero': {
                     return <div className="text-2xl">Hero section</div>;
                  }
                  default: {
                     return null;
                  }
               }
            })}
         </div>
      </>
   );
}
