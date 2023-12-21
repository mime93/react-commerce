import { AppProviders } from '@components/common/AppProviders';
import { DEFAULT_STORE_CODE } from '@config/env';
import { getLayoutServerSideProps } from '@layouts/default/server';
import { ReactNode } from 'react';
import IFixitPageFrame from './components/ifixit-page-frame';
import { LayoutDataProvider } from './components/layout-data-provider';

export default async function DefaultLayout({
   children,
}: {
   children: ReactNode;
}) {
   const layoutProps = await getLayoutServerSideProps({
      storeCode: DEFAULT_STORE_CODE,
   });

   return (
      <AppProviders>
         <LayoutDataProvider props={layoutProps}>
            <IFixitPageFrame {...layoutProps}>{children}</IFixitPageFrame>
         </LayoutDataProvider>
      </AppProviders>
   );
}
