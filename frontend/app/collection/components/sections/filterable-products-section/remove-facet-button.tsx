import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useId } from 'react';

interface RemoveFacetButtonProps {
   facetName: string;
   facetValue: string;
}

export function RemoveFacetButton({ facetName }: RemoveFacetButtonProps) {
   const id = useId();
   return (
      <label htmlFor={id} className="inline-flex items-center">
         <input
            id={id}
            type="radio"
            name={facetName}
            value=""
            className="absolute opacity-0 w-0 h-0 cursor-pointer"
         />
         <FontAwesomeIcon
            icon={faXmark}
            className="h-4 w-4 text-brand-300"
            aria-hidden="true"
         />
      </label>
   );
}
