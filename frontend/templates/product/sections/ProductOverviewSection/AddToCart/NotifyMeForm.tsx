import {
   Alert,
   Box,
   Button,
   Flex,
   FormControl,
   FormErrorMessage,
   FormLabel,
   Input,
   Text,
} from '@chakra-ui/react';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FaIcon } from '@ifixit/icons';
import { useIFixitApiClient } from '@ifixit/ifixit-api-client/hooks';
import { useProductTemplateProps } from '@templates/product/hooks/useProductTemplateProps';
import * as React from 'react';

enum NotifyMeStatus {
   Idle = 'idle',
   Submitting = 'submitting',
   Submitted = 'submitted',
   Error = 'error',
}

export type NotifyMeFormProps = {
   sku: string;
};

export function NotifyMeForm({ sku }: NotifyMeFormProps) {
   const { layoutProps } = useProductTemplateProps();
   const [status, setStatus] = React.useState<NotifyMeStatus>(
      NotifyMeStatus.Idle
   );

   const ifixitAPI = useIFixitApiClient();

   const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus(NotifyMeStatus.Submitting);
      try {
         const formData = new FormData(event.currentTarget);
         const email = formData.get('email');
         if (typeof email != 'string') {
            throw new Error('email is required');
         }
         await ifixitAPI.post(
            'cart/product/notifyWhenSkuInStock',
            'notify-when-sku-in-stock',
            {
               credentials: 'same-origin',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  sku,
                  shop_domain: layoutProps.shopifyCredentials.storefrontDomain,
                  email,
               }),
            }
         );
         setStatus(NotifyMeStatus.Submitted);
      } catch (error) {
         setStatus(NotifyMeStatus.Error);
      }
   };

   if (status === NotifyMeStatus.Submitted) {
      return (
         <Alert status="success" data-testid="notify-me-form-successful">
            <FaIcon icon={faCheckCircle} h="5" mr="2" color="green.700" />
            You will be notified when this product is back in stock.
         </Alert>
      );
   }

   return (
      <Box
         bg="brand.100"
         borderWidth="1px"
         borderColor="brand.200"
         borderRadius="md"
         w="full"
         px="3"
         py="4"
         data-testid="notify-me-form"
      >
         <form onSubmit={handleFormSubmit}>
            <Text fontWeight="semibold" mb="1.5">
               Notify me when it is back in stock!
            </Text>
            <Text>
               Enter your email address below, and we will notify you when this
               product is back in stock.
            </Text>
            <Flex mt="2.5" align="flex-start">
               <FormControl isInvalid={status === NotifyMeStatus.Error}>
                  <FormLabel htmlFor="notify-me-email" srOnly>
                     Email address
                  </FormLabel>
                  <Input
                     id="notify-me-email"
                     type="email"
                     name="email"
                     required
                     isDisabled={status === NotifyMeStatus.Submitting}
                     placeholder="Email"
                     variant="filled"
                     bg="white"
                     borderColor="gray.300"
                     borderWidth={1}
                     flex="1"
                     _hover={{ bg: 'gray.100' }}
                     _focus={{ bg: 'white', boxShadow: 'outline' }}
                  />
                  {status === NotifyMeStatus.Error && (
                     <FormErrorMessage>Request failed</FormErrorMessage>
                  )}
               </FormControl>
               <Button
                  type="submit"
                  isLoading={status === NotifyMeStatus.Submitting}
                  isDisabled={status === NotifyMeStatus.Submitting}
                  colorScheme="brand"
                  ml="2.5"
                  px="4"
                  flexShrink={0}
                  lineHeight="1em"
               >
                  Notify me
               </Button>
            </Flex>
         </form>
      </Box>
   );
}
