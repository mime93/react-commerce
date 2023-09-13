import { classNames } from '@helpers/tailwind-helpers';
import { map, size } from 'lodash';
import { RemoveFacetButton } from './remove-facet-button';
import { getFacetDisplayName } from 'app/collection/helpers/facet-helpers';

interface CurrentRefinementsProps {
   refinements?: Record<string, string[]>;
}

export function CurrentRefinements({ refinements }: CurrentRefinementsProps) {
   if (size(refinements) === 0) return null;

   return (
      <div className="pb-4">
         <ul className="flex flex-wrap">
            {map(refinements, (values, facetName) => {
               const displayName = getFacetDisplayName(facetName);
               return values.map((value) => {
                  const id = `current-refinement-${facetName}//${value}`;
                  return (
                     <li
                        key={id}
                        className={classNames(
                           'flex items-center px-1 py-0.5 space-x-1 mb-1.5 max-w-full',
                           'bg-brand-100 border border-brand-300 rounded',
                           'font-medium text-sm text-brand-700',
                           '[&:has(input:checked)]:hidden'
                        )}
                     >
                        <span className="truncate text-ellipsis overflow-hidden">
                           {displayName}: {value}
                        </span>
                        <RemoveFacetButton
                           facetName={facetName}
                           facetValue={value}
                        />
                     </li>
                  );
               });
            })}
         </ul>
      </div>
   );
}
