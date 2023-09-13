'use client';

import { useEffect, useState } from 'react';

export function useIsMountedState() {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   return isMounted;
}
