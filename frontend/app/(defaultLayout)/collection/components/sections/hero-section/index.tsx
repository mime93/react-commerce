import { classNames } from '@helpers/ui-helpers';
import { isPresent } from '@ifixit/helpers';
import { ResponsiveImage } from '@ifixit/ui';
import type { Image } from '@models/components/image';
import { Wrapper } from 'app/(defaultLayout)/components/wrapper';
import NextImage from 'next/image';
import * as React from 'react';
import { usePage } from '../../../hooks/use-page';
import { DescriptionRichText, HeroDescription } from './hero-description';

export interface HeroSectionProps {
   title: string;
   tagline?: string | null;
   description?: string | null;
   backgroundImage?: Image | null;
   brandLogo?: Image | null;
}

export function HeroSection({
   title,
   tagline,
   description,
   backgroundImage,
   brandLogo,
}: HeroSectionProps) {
   const page = usePage();
   const isFirstPage = page === 1;
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
                     <HeroTitle page={page}>{title}</HeroTitle>
                     {isPresent(tagline) && (
                        <h2 className="font-medium" data-testid="hero-tagline">
                           {tagline}
                        </h2>
                     )}
                     {isPresent(description) && (
                        <DescriptionRichText mt="4">
                           {description}
                        </DescriptionRichText>
                     )}
                  </div>
               </div>
            ) : (
               <div className="flex flex-col">
                  <HeroTitle page={page}>{title}</HeroTitle>
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
                           <HeroDescription>{description}</HeroDescription>
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
