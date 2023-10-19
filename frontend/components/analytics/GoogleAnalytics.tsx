import { GA_URL, GTAG_ID, GA_KEY, GA_DEBUG } from '@config/env';
import * as React from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useGACustomDimensions, setupMinimumGA4 } from '@ifixit/analytics';

declare const ga: (command: string, hitType: string, url?: string) => void;

// NOTE: GA4 is setup in _document.tsx
export function GoogleAnalytics() {
   const router = useRouter();
   React.useEffect(() => {
      const handleRouteChange = (url: string) => {
         if (typeof ga !== 'undefined') {
            ga('ifixit.set', 'page', url);
            ga('ifixit.send', 'pageview');
         }
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      router.events.on('hashChangeComplete', handleRouteChange);
      return () => {
         router.events.off('routeChangeComplete', handleRouteChange);
         router.events.off('hashChangeComplete', handleRouteChange);
      };
   }, [router?.events]);

   const wantsUA = GA_URL && GA_KEY;
   const wantsGA4 = GTAG_ID;
   return (
      <>
         {wantsGA4 && <GA4 />}
         {wantsUA && <UA />}
      </>
   );
}

function GA4() {
   const router = useRouter();
   const { query } = router;
   const dimensions = useGACustomDimensions();

   console.log('dimensions', dimensions);

   const debugMode = GA_DEBUG || query.ga4_debug === 'true';
   React.useEffect(() => {
      setupMinimumGA4(GTAG_ID, debugMode, dimensions);
   }, [dimensions]);
   return (
      <Script
         strategy="afterInteractive"
         src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
      ></Script>
   );
}

function UA() {
   return (
      <>
         <Script id="google-analytics" strategy="afterInteractive">
            {`
         window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;

         if (${GA_DEBUG} === true) {
            window.ga_debug = {trace: true};
         }

         ga('create', '${GA_KEY}', 'auto', 'ifixit', {'legacyCookieDomain': 'ifixit.com'});
         ga('ifixit.set', 'anonymizeIp', true);

         // Do not lazy load.
         ga('ifixit.set', 'dimension2', '0');

         // Load the enhanced ecommerce plug-in.
         ga('ifixit.require', 'ec');

         // Enable Remarketing and Advertising Reporting Features in GA
         ga('ifixit.require', 'displayfeatures');

         ga('ifixit.set', 'page', window.location.pathname);
         ga('ifixit.send', 'pageview');
      `}
         </Script>
         <Script src={GA_URL} strategy="afterInteractive" />
      </>
   );
}
