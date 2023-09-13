import { getFacetDisplayName } from 'app/collection/helpers/facet-helpers';

interface FacetFilterProps {
   facetName: string;
   facetValues: Record<string, number>;
   selectedValues?: string[];
}

export function FacetFilter({
   facetName,
   facetValues,
   selectedValues,
}: FacetFilterProps) {
   const facetDisplayName = getFacetDisplayName(facetName);
   return (
      <div>
         <div className="font-medium py-2 hover:bg-gray-100 rounded px-1 cursor-pointer my-1 transition-colors">
            {facetDisplayName}
         </div>
         <ul className="px-1">
            {Object.entries(facetValues).map(([facetValue, count]) => {
               const id = `${facetName}//${facetValue}`;

               return (
                  <li key={facetValue} className="flex justify-between">
                     <div>
                        <input
                           id={id}
                           type="radio"
                           name={facetName}
                           value={facetValue}
                           defaultChecked={
                              selectedValues?.includes(facetValue) ?? false
                           }
                           className="peer absolute opacity-0 w-0 h-0 cursor-pointer"
                        />
                        <label
                           htmlFor={id}
                           className="peer-checked:text-brand-500 peer-checked:font-semibold font-normal text-gray-800 cursor-pointer hover:underline"
                        >
                           {facetValue}
                        </label>
                     </div>
                     <span className="text-gray-500">{count}</span>
                  </li>
               );
            })}
         </ul>
      </div>
   );
}
