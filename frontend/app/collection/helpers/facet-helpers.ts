import { startCase } from 'lodash';

export function getFacetDisplayName(facetName: string) {
   let displayName = facetName.replace('facet_tags.', '');
   displayName = startCase(displayName);
   return displayName;
}
