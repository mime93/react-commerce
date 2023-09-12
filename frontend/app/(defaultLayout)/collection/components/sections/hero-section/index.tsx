import {
   Box,
   BoxProps,
   Button,
   Flex,
   forwardRef,
   Heading,
   Image as ChakraImage,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import { DEFAULT_ANIMATION_DURATION_MS } from '@config/constants';
import { markdownToHTML } from '@helpers/ui-helpers';
import { isPresent } from '@ifixit/helpers';
import { ResponsiveImage, useIsMounted, Wrapper } from '@ifixit/ui';
import type { Image } from '@models/components/image';
import * as React from 'react';
import { usePagination } from 'react-instantsearch-hooks-web';
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
   const pagination = usePagination();
   const page = pagination.currentRefinement + 1;
   const isFirstPage = page === 1;
   return (
      <Wrapper as="section" my={{ base: 4, md: 6 }}>
         {backgroundImage ? (
            <Flex
               pos="relative"
               minH="96"
               borderRadius="base"
               overflow="hidden"
            >
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

               <Box
                  zIndex={-1}
                  position="absolute"
                  top="0"
                  left="0"
                  w="full"
                  h="full"
                  bgGradient="linear-gradient(90deg, rgba(0, 0, 0, 0.6) 28.7%, rgba(0, 0, 0, 0.1) 86.8%);"
               />

               <Flex
                  alignSelf="flex-end"
                  direction="column"
                  color="white"
                  maxW={{ base: 'full', md: '50%', lg: '40%' }}
                  pt="24"
                  m={{ base: 4, md: 8 }}
               >
                  {brandLogo && brandLogo.width && (
                     <ChakraImage
                        src={brandLogo.url}
                        alt={brandLogo.altText ?? ''}
                        width={brandLogo.width}
                        mb="4"
                     />
                  )}
                  <HeroTitle page={page}>{title}</HeroTitle>
                  {isPresent(tagline) && (
                     <Text
                        as="h2"
                        fontWeight="medium"
                        data-testid="hero-tagline"
                     >
                        {tagline}
                     </Text>
                  )}
                  {isPresent(description) && (
                     <DescriptionRichText mt="4">
                        {description}
                     </DescriptionRichText>
                  )}
               </Flex>
            </Flex>
         ) : (
            <Flex direction="column">
               <HeroTitle page={page}>{title}</HeroTitle>
               {isFirstPage && (
                  <>
                     {isPresent(tagline) && (
                        <Text
                           as="h2"
                           fontWeight="medium"
                           data-testid="hero-tagline"
                        >
                           {tagline}
                        </Text>
                     )}
                     {isPresent(description) && (
                        <HeroDescription>{description}</HeroDescription>
                     )}
                  </>
               )}
            </Flex>
         )}
      </Wrapper>
   );
}

function HeroTitle({
   children,
   page,
}: React.PropsWithChildren<{ page: number }>) {
   // Place non-breaking space between 'Page' and page number
   return (
      <Heading
         as="h1"
         size="xl"
         fontSize={{ base: '2xl', md: '3xl' }}
         fontWeight="medium"
         data-testid="hero-title"
      >
         {children}
         {page > 1 ? (
            <>
               {' - Page'}
               <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
               {page}
            </>
         ) : (
            ''
         )}
      </Heading>
   );
}
