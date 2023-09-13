import { markdownToHTML } from '@helpers/markdown-helpers';
import { classNames } from '@helpers/tailwind-helpers';
import { isPresent } from '@ifixit/helpers';
import type { Image } from '@models/components/image';
import { Wrapper } from 'app/(defaultLayout)/components/wrapper';
import { ResponsiveImage } from 'app/components/ui/responsive-image';
import NextImage from 'next/image';
import * as React from 'react';
import { forwardRef } from 'react';
import { CollapsibleDescription } from './collapsible-description';

export interface HeroSectionProps {
   title: string;
   tagline?: string | null;
   description?: string | null;
   backgroundImage?: Image | null;
   brandLogo?: Image | null;
   productListPage: number;
}

export function HeroSection({
   title,
   tagline,
   description,
   backgroundImage,
   brandLogo,
   productListPage,
}: HeroSectionProps) {
   const isFirstPage = productListPage === 1;
   const descriptionHtml = markdownToHTML(description ?? '');
   return (
      <section className="my-4 md:my-6">
         <Wrapper>
            {backgroundImage ? (
               <div className="flex relative min-h-[384px] rounded overflow-hidden">
                  <ResponsiveImage
                     priority
                     fill
                     style={{
                        objectFit: 'cover',
                        zIndex: -1,
                     }}
                     src={backgroundImage.url}
                     alt={backgroundImage.altText ?? ''}
                  />

                  <div
                     className={classNames(
                        'z-[-1] absolute top-0 left-0 w-full h-full min-h-[384px]',
                        'bg-gradient-to-r from-black/60 from-30% to-black/10 to-85%'
                     )}
                  />

                  <div className="flex flex-col self-end text-white max-w-full md:max-w-[50%] lg:max-w-[40%] pt-24 m-4 md:m-8">
                     {brandLogo && brandLogo.width && (
                        <NextImage
                           unoptimized
                           src={brandLogo.url}
                           alt={brandLogo.altText ?? ''}
                           width={brandLogo.width}
                           className="mb-4"
                        />
                     )}
                     <HeroTitle page={productListPage}>{title}</HeroTitle>
                     {isPresent(tagline) && (
                        <h2 className="font-medium" data-testid="hero-tagline">
                           {tagline}
                        </h2>
                     )}
                     {isPresent(description) && (
                        <DescriptionRichText className="mt-4">
                           {descriptionHtml}
                        </DescriptionRichText>
                     )}
                  </div>
               </div>
            ) : (
               <div className="flex flex-col">
                  <HeroTitle page={productListPage}>{title}</HeroTitle>
                  {isFirstPage && (
                     <>
                        {isPresent(tagline) && (
                           <h2
                              className="font-medium"
                              data-testid="hero-tagline"
                           >
                              {tagline}
                           </h2>
                        )}
                        {isPresent(description) && (
                           <CollapsibleDescription>
                              <DescriptionRichText>
                                 {descriptionHtml}
                              </DescriptionRichText>
                           </CollapsibleDescription>
                        )}
                     </>
                  )}
               </div>
            )}
         </Wrapper>
      </section>
   );
}

function HeroTitle({
   children,
   page,
}: React.PropsWithChildren<{ page: number }>) {
   // Place non-breaking space between 'Page' and page number
   return (
      <h1 className="text-2xl md:text-3xl font-medium" data-testid="hero-title">
         {children}
         {page > 1 && (
            <>
               {' - Page'}
               <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
               {page}
            </>
         )}
      </h1>
   );
}

interface DescriptionRichTextProps {
   children: string;
   className?: string;
}

const DescriptionRichText = forwardRef<
   HTMLDivElement,
   DescriptionRichTextProps
>(({ children, className }, ref) => {
   return (
      <div
         ref={ref}
         className={classNames(
            className,
            'prose',
            'prose-a:text-brand-500 prose-a:transition-colors prose-a:hover:text-brand-600'
         )}
         dangerouslySetInnerHTML={{ __html: children }}
      />
   );
});
