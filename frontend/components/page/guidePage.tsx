import { chakra } from '@chakra-ui/react';
import Head from 'next/head';
import * as React from 'react';
import cp from '@core-ds/primitives';

export default function GuidePage({
   title,
   children,
}: {
   title: string;
   children: React.ReactNode;
}) {
   const Main = chakra('main');

   return (
      <React.Fragment>
         <Head>
            <title>{title + ' - iFixit'}</title>
         </Head>
         <Main
            margin={`${cp.space[8]} auto ${cp.space[10]}`}
            maxWidth={{ base: '90%', xl: '1000px' }}
         >
            {children}
         </Main>
      </React.Fragment>
   );
}
