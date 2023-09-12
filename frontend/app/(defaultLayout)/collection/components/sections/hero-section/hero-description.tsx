'use client';

import {
   Box,
   BoxProps,
   Button,
   forwardRef,
   useDisclosure,
} from '@chakra-ui/react';
import { DEFAULT_ANIMATION_DURATION_MS } from '@config/constants';
import { markdownToHTML } from '@helpers/ui-helpers';
import { useIsMounted } from '@ifixit/ui';
import * as React from 'react';

const NUMBER_OF_LINES = 5;
const LINE_HEIGHT = 25;
const VISIBLE_HEIGHT = NUMBER_OF_LINES * LINE_HEIGHT;

interface HeroDescriptionProps {
   children: string;
}

export function HeroDescription({ children }: HeroDescriptionProps) {
   const { isOpen, onToggle } = useDisclosure();
   const isMounted = useIsMounted();
   const textRef = React.useRef<HTMLParagraphElement | null>(null);
   const textHeight = React.useMemo(() => {
      if (isMounted && textRef.current) {
         return textRef.current.clientHeight;
      }
      return 0;
   }, [isMounted, textRef]);
   const isShowMoreVisible = textHeight > VISIBLE_HEIGHT;

   return (
      <Box mt="4" data-testid="hero-description">
         <Box
            maxH={isOpen ? textHeight : VISIBLE_HEIGHT}
            overflow="hidden"
            transition={`all ${DEFAULT_ANIMATION_DURATION_MS}ms`}
         >
            <DescriptionRichText ref={textRef}>{children}</DescriptionRichText>
         </Box>
         {isShowMoreVisible && (
            <Button
               variant="link"
               color="gray.800"
               size="sm"
               onClick={onToggle}
               mt="1"
               pl="2"
               pr="2"
               py="1"
               ml="-8px"
               display="block"
            >
               {isOpen ? 'Show less' : 'Show more'}
            </Button>
         )}
      </Box>
   );
}

type DescriptionRichTextProps = Omit<BoxProps, 'children'> & {
   children: string;
};

export const DescriptionRichText = forwardRef<DescriptionRichTextProps, 'div'>(
   ({ children, ...other }, ref) => {
      const html = React.useMemo(() => markdownToHTML(children), [children]);

      return (
         <Box
            sx={{
               a: {
                  color: 'brand.500',
                  transition: 'color 300ms',
                  '&:hover': {
                     color: 'brand.600',
                  },
               },
            }}
            ref={ref}
            dangerouslySetInnerHTML={{ __html: html }}
            {...other}
         />
      );
   }
);
