import {
   chakra,
   Icon,
   IconButton,
   Input,
   InputGroup,
   InputLeftElement,
   InputRightElement,
} from '@chakra-ui/react';
import { useSearch } from '@lib/algolia';
import * as React from 'react';
import { HiXCircle } from 'react-icons/hi';
import { RiSearchLine } from 'react-icons/ri';

interface SearchInputProps {
   className?: string;
}

const MAX_SEARCH_QUERY_LENGTH = 100;

export const SearchInput = chakra(({ className }: SearchInputProps) => {
   const inputRef = React.useRef<HTMLInputElement>(null);
   const [query, search] = useSearch();

   const clearSearch = React.useCallback(() => {
      search('');
      if (inputRef.current) {
         inputRef.current.focus();
      }
   }, [search]);

   const onSearchChange = React.useCallback<
      React.ChangeEventHandler<HTMLInputElement>
   >(
      (event) => {
         let newValue = event.currentTarget.value;
         if (newValue.length > MAX_SEARCH_QUERY_LENGTH) {
            newValue = newValue.slice(0, MAX_SEARCH_QUERY_LENGTH);
         }
         search(newValue);
      },
      [search]
   );

   return React.useMemo(
      () => (
         <InputGroup className={className}>
            <InputLeftElement pointerEvents="none">
               <Icon as={RiSearchLine} color="gray.300" />
            </InputLeftElement>
            <Input
               ref={inputRef}
               bg="white"
               placeholder="Search"
               tabIndex={0}
               onChange={onSearchChange}
               value={query}
            />
            <InputRightElement
               opacity={query.length > 0 ? 1 : 0}
               pointerEvents={query.length > 0 ? 'initial' : 'none'}
            >
               <IconButton
                  disabled={query.length === 0}
                  variant="ghost"
                  aria-label="clear search"
                  onClick={clearSearch}
                  _hover={{
                     bg: 'transparent',
                  }}
                  _active={{
                     bg: 'transparent',
                  }}
                  icon={
                     <Icon
                        as={HiXCircle}
                        color="gray.300"
                        transition="color 300ms"
                        _hover={{ color: 'gray.500' }}
                     />
                  }
               />
            </InputRightElement>
         </InputGroup>
      ),
      [className, clearSearch, query, search]
   );
});
