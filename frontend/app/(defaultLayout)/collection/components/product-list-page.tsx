import { getiFixitOriginFromHost } from '@helpers/path-helpers';
import ProductListCache from '@pages/api/nextjs/cache/product-list';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { HeroSection } from './sections/hero-section';

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
   page?: number;
}

export default async function ProductListPage({
   handle,
   page = 1,
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
                     return (
                        <HeroSection
                           key={section.id}
                           title={productList.h1 ?? productList.title}
                           tagline={productList.tagline}
                           description={productList.description}
                           backgroundImage={productList.heroImage}
                           brandLogo={productList.brandLogo}
                           productListPage={page}
                        />
                     );
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
