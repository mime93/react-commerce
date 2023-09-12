'use client';

// import {
//    Box,
//    BoxProps,
//    forwardRef
// } from '@chakra-ui/react';
import { classNames, markdownToHTML } from '@helpers/ui-helpers';
import { useIsMounted } from '@ifixit/ui';
import * as React from 'react';
import { forwardRef } from 'react';

const NUMBER_OF_LINES = 5;
const LINE_HEIGHT = 25;
const VISIBLE_HEIGHT = NUMBER_OF_LINES * LINE_HEIGHT;

interface HeroDescriptionProps {
   children: string;
}

export function HeroDescription({ children }: HeroDescriptionProps) {
   const [isOpen, setIsOpen] = React.useState(false);
   const onToggle = React.useCallback(() => setIsOpen((prev) => !prev), []);
   const isMounted = useIsMounted();
   const textRef = React.useRef<HTMLParagraphElement | null>(null);
   const textHeight = React.useMemo(() => {
      if (isMounted && textRef.current) {
         return textRef.current.clientHeight;
      }
      return 0;
   }, [isMounted, textRef]);
   const isShowMoreVisible = textHeight > VISIBLE_HEIGHT;

   const cssVariablesStyles = {
      '--text-height': textHeight,
      '--visible-height': VISIBLE_HEIGHT,
   } as React.CSSProperties;

   return (
      <div
         className="mt-4"
         data-testid="hero-description"
         style={cssVariablesStyles}
      >
         <div
            className={classNames(
               'overflow-hidden transition-all',
               isOpen
                  ? 'max-h-[var(--text-height)]'
                  : 'max-h-[var(--visible-height)]'
            )}
         >
            <DescriptionRichText ref={textRef}>{children}</DescriptionRichText>
         </div>
         {isShowMoreVisible && (
            <button
               className={classNames(
                  'blocktext-gray-800 mt-1 pl-2 pr-2 py-1 -ml-2'
               )}
               onClick={onToggle}
            >
               {isOpen ? 'Show less' : 'Show more'}
            </button>
         )}
      </div>
   );
}

type DescriptionRichTextProps = {
   children: string;
   className?: string;
};

export const DescriptionRichText = forwardRef<
   HTMLDivElement,
   DescriptionRichTextProps
>(({ children, className }, ref) => {
   const html = React.useMemo(() => markdownToHTML(children), [children]);

   return (
      <div
         ref={ref}
         className={classNames(className)}
         sx={{
            a: {
               color: 'brand.500',
               transition: 'color 300ms',
               '&:hover': {
                  color: 'brand.600',
               },
            },
         }}
         dangerouslySetInnerHTML={{ __html: html }}
      />
   );
});
