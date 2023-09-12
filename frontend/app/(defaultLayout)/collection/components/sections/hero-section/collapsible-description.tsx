'use client';

import { classNames } from '@helpers/tailwind-helpers';
import { useIsMountedState } from 'app/hooks/lifecycle';
import * as React from 'react';

const NUMBER_OF_LINES = 5;
const LINE_HEIGHT = 25;
const VISIBLE_HEIGHT = NUMBER_OF_LINES * LINE_HEIGHT;

export function CollapsibleDescription({
   children,
}: React.PropsWithChildren<{}>) {
   const [isOpen, setIsOpen] = React.useState(false);
   const onToggle = React.useCallback(() => setIsOpen((prev) => !prev), []);
   const isMounted = useIsMountedState();
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
            <div ref={textRef}>{children}</div>
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
