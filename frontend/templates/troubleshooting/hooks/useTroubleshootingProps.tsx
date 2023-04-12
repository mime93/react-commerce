import { WithProvidersProps } from '@components/common';
import type { WithLayoutProps } from '@layouts/default/server';

export type Section = {
   heading: string;
   body: string;
};

export type Author = {
   userid: number;
   percent: number;
   username: string;
   avatar: string;
   profileUrl: string;
};

export type TroubleshootingData = {
   title: string;
   toc: string;
   introduction: Section[];
   solutions: Section[];
   conclusion: Section[];
   editUrl: string;
   historyUrl: string;
   deviceGuideUrl?: string;
   devicePartsUrl?: string;
   canonicalUrl: string;
   lastUpdatedDate: number;
   authors: Author[];
   hreflangUrls: Record<string, string>;
   breadcrumbs: BreadcrumbEntry[];
   metaDescription: string;
   metaKeywords: string;
};

export type BreadcrumbEntry = {
   title: string;
   url: string;
};

type TroubleshootingPageProps = {
   wikiData: TroubleshootingData;
};
export type TroubleshootingProps = WithProvidersProps<
   WithLayoutProps<TroubleshootingPageProps>
>;
