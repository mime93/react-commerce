'use client';

import { SentryError } from '@ifixit/sentry';
import type { DefaultLayoutProps } from '@layouts/default/server';
import React from 'react';

const LayoutContext = React.createContext<DefaultLayoutProps | null>(null);

type LayoutDataProviderProps = React.PropsWithChildren<{
   props: DefaultLayoutProps;
}>;

export function LayoutDataProvider({
   props,
   children,
}: LayoutDataProviderProps) {
   return (
      <LayoutContext.Provider value={props}>{children}</LayoutContext.Provider>
   );
}

export function useLayoutData() {
   const value = React.useContext(LayoutContext);

   if (value == null)
      throw new SentryError(
         'useLayoutData must be used within LayoutDataProvider'
      );

   return value;
}
