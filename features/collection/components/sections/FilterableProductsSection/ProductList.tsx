import {
   AspectRatio,
   Badge,
   Box,
   Button,
   Divider,
   Heading,
   HStack,
   Img,
   StackProps,
   Text,
   VStack,
} from '@chakra-ui/react';
import { ShopifyImage } from '@components/ShopifyImage';
import { ProductHit } from '@features/collection';
import * as React from 'react';
import { FaStar } from 'react-icons/fa';

const placeholderImageUrl =
   'https://via.placeholder.com/180x135?text=not+available';

export type ProductListProps = React.PropsWithChildren<unknown>;

export function ProductList({ children }: ProductListProps) {
   return (
      <VStack
         spacing={2}
         align="stretch"
         width="full"
         boxSizing="border-box"
         divider={<Divider />}
      >
         {children}
      </VStack>
   );
}

export interface ProductListItemProps {
   product: ProductHit;
}

export function ProductListItem({ product }: ProductListItemProps) {
   const isDiscounted =
      product.compare_at_price != null &&
      product.compare_at_price > product.price;
   return (
      <HStack
         key={product.handle}
         spacing={4}
         py="7"
         alignItems="flex-start"
         px="4"
      >
         <AspectRatio
            flexGrow={1}
            flexShrink={0}
            w={{
               base: '100px',
               sm: '160px',
               md: '140px',
               lg: '180px',
            }}
            ratio={1}
         >
            {product.product_image == null ? (
               <Img
                  sizes="180px"
                  src={placeholderImageUrl}
                  alt={product.title}
               />
            ) : (
               <ShopifyImage
                  src={product.product_image || placeholderImageUrl}
                  alt={product.title}
                  sizes="180px"
               />
            )}
         </AspectRatio>
         <VStack
            align="flex-start"
            spacing={{
               base: 4,
            }}
            flexShrink={1}
            w="full"
         >
            <Heading
               as="h2"
               fontSize={{
                  base: 'sm',
                  sm: 'md',
                  lg: 'lg',
               }}
            >
               {product.title}
            </Heading>
            <Text
               noOfLines={2}
               fontSize={{
                  base: 'xs',
                  sm: 'sm',
                  lg: 'md',
               }}
            >
               {product.body_html_safe}
            </Text>
            <HStack>
               {product.inventory_quantity > 0 ? (
                  <>
                     <Badge
                        colorScheme="blue"
                        textTransform="none"
                        borderRadius="lg"
                        px="2.5"
                        py="1"
                     >
                        Lifetime warranty
                     </Badge>
                     <Badge
                        colorScheme="blue"
                        textTransform="none"
                        borderRadius="lg"
                        px="2.5"
                        py="1"
                     >
                        Ship today if ordered by 5pm
                     </Badge>
                  </>
               ) : (
                  <Badge
                     colorScheme="gray"
                     textTransform="none"
                     borderRadius="lg"
                     px="2.5"
                     py="1"
                  >
                     Out of stock
                  </Badge>
               )}
            </HStack>
            <HStack>
               <Rating value={4} />
               <Text>102</Text>
            </HStack>
         </VStack>
         <VStack>
            <VStack>
               {isDiscounted && (
                  <Text textDecoration="line-through" color="gray.400">
                     ${product.compare_at_price}
                  </Text>
               )}
               <Text
                  color={isDiscounted ? 'red.700' : 'inherit'}
                  fontWeight="bold"
               >
                  ${product.price}
               </Text>
            </VStack>
            <Button colorScheme="brand">View</Button>
            <Text color="gray.500" fontSize="14px">
               {product.inventory_quantity > 0 &&
               product.inventory_quantity < 10
                  ? `
               Only ${product.inventory_quantity} left in stock
               `
                  : `${product.inventory_quantity} in stock`}
            </Text>
         </VStack>
      </HStack>
   );
}

interface RatingProps extends StackProps {
   value?: number;
}

export const Rating = (props: RatingProps) => {
   const { value = 5, ...rest } = props;
   return (
      <HStack spacing="1" {...rest}>
         {Array.from({ length: 5 }).map((_, i) => {
            const fade = i + 1 > value;
            return (
               <Box
                  as={FaStar}
                  color={fade ? 'gray.300' : 'blue.500'}
                  fontSize="larger"
                  key={i}
               />
            );
         })}
      </HStack>
   );
};
