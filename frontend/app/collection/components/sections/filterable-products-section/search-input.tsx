import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useId } from 'react';

interface SearchInputProps {
   className?: string;
   placeholder?: string;
   defaultValue?: string;
}

export function SearchInput({
   className,
   placeholder,
   defaultValue,
}: SearchInputProps) {
   const id = useId();
   return (
      <div className={className}>
         <label htmlFor={id} className="sr-only">
            Search
         </label>
         <div className="relative mt-2 rounded-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 h-full flex items-center pl-3">
               <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="h-4 w-4 text-gray-300"
                  aria-hidden="true"
               />
            </div>
            <input
               type="search"
               name="q"
               id={id}
               className="block w-full rounded border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
               placeholder={placeholder}
               defaultValue={defaultValue}
            />
         </div>
      </div>
   );
}
