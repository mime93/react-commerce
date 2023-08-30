import { DEFAULT_STORE_CODE } from '@config/env';
import { DefaultLayout } from '@layouts/default';
import {
   WithLayoutProps,
   getLayoutServerSideProps,
} from '@layouts/default/server';
import { ServerSidePropsProvider } from '@lib/server-side-props';
import { Metadata } from 'next';
import ListPageTemplate from '@templates/troubleshooting/ListPageTemplate';
import { AppProviders } from '@components/common/AppProviders';

export type PageParams = {
   device: string;
   id: string;
};

export type PageProps = {
   params: PageParams;
   searchParams: Record<string, string>;
};

export default async function Page({ params, searchParams }: PageProps) {
   const pageProps = await getPageProps({ params, searchParams });

   const { device, id } = pageProps;

   return (
      <ServerSidePropsProvider props={pageProps}>
         <AppProviders>
            <DefaultLayout {...pageProps.layoutProps}>
               <ListPageTemplate device={device} id={id} />
            </DefaultLayout>
         </AppProviders>
      </ServerSidePropsProvider>
   );
}

async function getPageProps({
   params,
   searchParams: _searchParams,
}: PageProps): Promise<WithLayoutProps<PageParams>> {
   const { device, id } = params;

   const layoutPropsPromise = getLayoutServerSideProps({
      storeCode: DEFAULT_STORE_CODE,
   });

   const pageProps = {
      layoutProps: {
         ...(await layoutPropsPromise),
      },
      device,
      id,
   };
   return pageProps;
}

export async function generateMetadata({
   params,
   searchParams: _searchParams,
}: PageProps): Promise<Metadata> {
   const { device, id } = params;

   const ifixitOrigin = 'https://www.cominor.com';
   const canonicalUrl = new URL(
      `${ifixitOrigin}/Troubleshooting/${device}/${id}`
   ).toString();
   const metaTitle = 'iFixit';
   const metaDescription = 'iFixit';
   const hreflangs = {
      'en-US': canonicalUrl,
      'de-DE': canonicalUrl,
   };

   return {
      metadataBase: new URL(ifixitOrigin),
      alternates: {
         canonical: canonicalUrl,
         languages: hreflangs,
      },
      robots: 'noindex, follow',
      title: metaTitle,
      description: metaDescription,
      openGraph: {
         type: 'website',
         url: canonicalUrl,
         title: metaTitle,
         description: metaDescription,
      },
   };
}
