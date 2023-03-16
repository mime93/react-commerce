import { Divider, Box, forwardRef, HStack, Icon, Text } from '@chakra-ui/react';
import type { DividerProps, FlexProps, StackProps } from '@chakra-ui/react';
import type { Menu } from '@ifixit/menu';
import { useTrackedOnClick } from '../hooks/useTrackedOnClick';
import { Wrapper } from '@ifixit/ui';

export interface FooterType {
   menu1: Menu | null;
   menu2: Menu | null;
   menu3: Menu | null;
   partners: Menu | null;
   bottomMenu: Menu | null;
}

export const Footer = forwardRef<FlexProps, 'footer'>(
   ({ children, ...otherProps }, ref) => {
      return (
         <Box ref={ref} as="footer" bg="black" py="12" {...otherProps}>
            <Wrapper>{children}</Wrapper>
         </Box>
      );
   }
);

type FooterLinkProps = StackProps & {
   icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
   eventCategory?: string;
   eventAction?: string;
   customColor?: string;
};

export const FooterLink = forwardRef<FooterLinkProps, 'a'>(
   (
      {
         fontSize = 'sm',
         href,
         children,
         icon,
         onClick,
         eventCategory,
         eventAction,
         customColor = 'white',
         ...otherProps
      },
      ref
   ) => {
      const trackedOnClick = useTrackedOnClick({
         href,
         onClick,
         eventCategory,
         eventAction,
      });
      return (
         <HStack
            ref={ref}
            as="a"
            align="center"
            color={customColor}
            transition="color 300ms"
            _visited={{ color: customColor }}
            _hover={{ color: 'white', textDecoration: 'none' }}
            href={href}
            onClick={trackedOnClick}
            {...otherProps}
         >
            <Text fontSize={fontSize} lineHeight="1em">
               {children}
            </Text>
            {icon && <Icon as={icon} boxSize="6" />}
         </HStack>
      );
   }
);

export const FooterDivider = forwardRef<DividerProps, 'hr'>((props, ref) => {
   return <Divider ref={ref} borderColor="gray.700" {...props} />;
});
