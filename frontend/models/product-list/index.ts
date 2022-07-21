import { ALGOLIA_DEFAULT_INDEX_NAME } from '@config/constants';
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '@config/env';
import { Awaited, filterNullableItems } from '@helpers/application-helpers';
import {
   getProductListPath,
   getProductListTitle,
} from '@helpers/product-list-helpers';
import { getImageFromStrapiImage } from '@helpers/strapi-helpers';
import { invariant } from '@ifixit/helpers';
import {
   DeviceWiki,
   fetchDeviceWiki,
   fetchMultipleDeviceImages,
} from '@lib/ifixit-api/devices';
import {
   Enum_Productlist_Type,
   ProductListFiltersInput,
   strapi,
} from '@lib/strapi-sdk';
import algoliasearch from 'algoliasearch';
import {
   ProductList,
   ProductListAncestor,
   ProductListChild,
   ProductListImage,
   ProductListSection,
   ProductListSectionType,
   ProductListType,
   ProductListOptions,
   BaseProductList,
} from './types';

export { ProductListSectionType, ProductListType } from './types';
export type {
   FeaturedProductList,
   ProductList,
   ProductListPreview,
   ProductListSection,
   ProductSearchHit,
   WikiInfoEntry,
} from './types';

/**
 * Get the product list data from the API
 */
export async function findProductList(
   filters: ProductListFiltersInput,
   options: ProductListOptions = {}
): Promise<ProductList | null> {
   const result = await strapi.getProductList({
      filters,
   });

   const productList = result.productLists?.data?.[0]?.attributes;

   const deviceTitle =
      productList?.deviceTitle ?? filters.deviceTitle?.eq ?? '';
   const deviceWiki = deviceTitle ? await fetchDeviceWiki(deviceTitle) : null;

   if (productList == null && deviceWiki == null) {
      return null;
   }

   const handle = productList?.handle ?? '';
   const parents =
      productList?.parent ??
      (deviceWiki?.ancestors
         ? convertAncestorsToStrapiFormat(deviceWiki.ancestors)
         : null);
   const title =
      productList?.title ??
      (deviceWiki?.title ? deviceWiki?.title + ' Parts' : '');
   const description =
      productList?.description ?? deviceWiki?.description ?? '';
   const productListImageAttributes = productList?.image?.data?.attributes;
   const image = productListImageAttributes
      ? getImageFromStrapiImage(productListImageAttributes, 'large')
      : deviceWiki
      ? getDeviceImage(deviceWiki)
      : null;

   const algoliaApiKey = createPublicAlgoliaKey(
      ALGOLIA_APP_ID,
      ALGOLIA_API_KEY
   );

   const baseProductListType = getProductListType(
      productList?.type ?? deviceWiki?.namespace
   );
   const productListType = options.itemType
      ? ProductListType.DeviceItemTypeParts
      : baseProductListType;

   const path = getProductListPath({
      type: productListType,
      handle: handle,
      deviceTitle: deviceTitle,
      itemType: options.itemType,
   });

   const ancestors = createProductListAncestors(parents);
   if (options.itemType) {
      ancestors.push({
         handle: handle,
         path: getProductListPath({
            type: baseProductListType,
            handle: handle,
            deviceTitle: deviceTitle,
         }),
         title: title, // <device title> parts
      });
   }

   const baseProductList: BaseProductList = {
      title: title,
      handle: handle,
      deviceTitle: deviceTitle,
      path,
      tagline: productList?.tagline ?? null,
      description: description,
      metaDescription: productList?.metaDescription ?? null,
      filters: productList?.filters ?? null,
      image: image,
      ancestors,
      // Strapi sort order is case sensitive, so we need to improve on it in memory
      children: await fillMissingImagesFromApi(
         sortProductListChildren(
            filterNullableItems(
               productList?.children?.data.map(
                  createProductListChild({
                     deviceWiki,
                     itemType: options.itemType,
                  })
               )
            )
         )
      ),
      childrenHeading: productList?.childrenHeading ?? null,
      sections: filterNullableItems(
         productList?.sections.map(createProductListSection)
      ),
      algolia: {
         apiKey: algoliaApiKey,
      },
      wikiInfo: deviceWiki?.info || [],
   };

   if (productListType === ProductListType.DeviceItemTypeParts) {
      invariant(
         options.itemType,
         'item type is required for device item type product list'
      );
      return {
         ...baseProductList,
         type: ProductListType.DeviceItemTypeParts,
         itemType: options.itemType,
      };
   }
   return {
      ...baseProductList,
      type: productListType,
   };
}

function getProductListType(
   type?: Enum_Productlist_Type | null
): ProductListType {
   switch (type) {
      case Enum_Productlist_Type.AllParts:
         return ProductListType.AllParts;
      case Enum_Productlist_Type.AllTools:
         return ProductListType.AllTools;
      case Enum_Productlist_Type.Tools:
         return ProductListType.ToolsCategory;
      case Enum_Productlist_Type.Marketing:
         return ProductListType.Marketing;
      default:
         return ProductListType.DeviceParts;
   }
}

function getDeviceImage(deviceWiki: DeviceWiki): ProductListImage | null {
   return deviceWiki?.image?.original == null
      ? null
      : {
           url: deviceWiki.image.original,
           alternativeText: null,
        };
}

async function fillMissingImagesFromApi(
   productListChildren: ProductListChild[]
): Promise<ProductListChild[]> {
   const childrenWithoutImages = productListChildren.filter(
      (child) => child.image == null && child.deviceTitle
   );
   if (childrenWithoutImages.length === 0) {
      return productListChildren;
   }
   const deviceTitlesWithoutImages = childrenWithoutImages.map(
      (child) => child.deviceTitle
   ) as string[]; // cast is safe cause we filter nulls above,
   // typescript just doesn't understand
   const imagesResponse = await fetchMultipleDeviceImages(
      deviceTitlesWithoutImages,
      'thumbnail'
   );
   childrenWithoutImages.forEach((child) => {
      const imageFromDevice =
         imagesResponse.images[child.deviceTitle as string];
      if (imageFromDevice != null) {
         child.image = {
            url: imageFromDevice,
            alternativeText: child.deviceTitle,
         };
      }
   });
   return productListChildren;
}

function getChildDeviceImage(
   deviceWiki: DeviceWiki,
   childDeviceTitle: string
): ProductListImage | null {
   const child = deviceWiki.children?.find(
      (c: any) => c.title === childDeviceTitle
   );
   if (child?.image?.original) {
      return {
         url: child.image.original,
         alternativeText: null,
      };
   }
   return null;
}

type StrapiProductListPageData = NonNullable<
   NonNullable<Awaited<ReturnType<typeof strapi['getProductList']>>>
>;

type ApiProductList = NonNullable<
   NonNullable<
      NonNullable<StrapiProductListPageData['productLists']>['data']
   >[0]['attributes']
>;

function convertAncestorsToStrapiFormat(
   ancestors: any
): ApiProductList['parent'] | null {
   const ancestor = ancestors.shift();
   if (ancestor == null) {
      return null;
   } else if (ancestor['title'] === 'Root') {
      ancestor['type'] = 'all_parts';
      ancestor['title'] = 'All';
      ancestor['handle'] = 'Parts';
   }
   return {
      data: {
         attributes: {
            type: ancestor.type,
            title: ancestor.title + ' Parts',
            handle: ancestor.handle ?? '',
            deviceTitle: ancestor.title,
            parent: convertAncestorsToStrapiFormat(ancestors),
         },
      },
   };
}

function createProductListAncestors(
   parent: ApiProductList['parent']
): ProductListAncestor[] {
   const attributes = parent?.data?.attributes;
   if (attributes == null) {
      return [];
   }
   const ancestors = createProductListAncestors(attributes.parent);

   const type = getProductListType(attributes.type);

   return ancestors.concat({
      title: getProductListTitle({
         title: attributes.title,
         type,
      }),
      handle: attributes.handle,
      path: getProductListPath({
         type,
         handle: attributes.handle,
         deviceTitle: attributes.deviceTitle ?? null,
      }),
   });
}

type ApiProductListChild = NonNullable<ApiProductList['children']>['data'][0];

type CreateProductListChildOptions = {
   deviceWiki: DeviceWiki | null;
   itemType?: string;
};

function createProductListChild({
   deviceWiki,
   itemType,
}: CreateProductListChildOptions) {
   return (apiChild: ApiProductListChild): ProductListChild | null => {
      const { attributes } = apiChild;
      if (attributes == null) {
         return null;
      }
      const imageAttributes = attributes.image?.data?.attributes;
      const type = itemType
         ? ProductListType.DeviceItemTypeParts
         : getProductListType(attributes.type);
      return {
         title: getProductListTitle({
            title: attributes.title,
            type,
            itemType,
         }),
         deviceTitle: attributes.deviceTitle || null,
         handle: attributes.handle,
         path: getProductListPath({
            type,
            handle: attributes.handle,
            deviceTitle: attributes.deviceTitle ?? null,
            itemType,
         }),
         image:
            imageAttributes == null
               ? deviceWiki && attributes.deviceTitle
                  ? getChildDeviceImage(deviceWiki, attributes.deviceTitle)
                  : null
               : getImageFromStrapiImage(imageAttributes, 'medium'),
         sortPriority: attributes.sortPriority || null,
      };
   };
}

function sortProductListChildren(
   children: ProductListChild[]
): ProductListChild[] {
   return children.slice().sort((a, b) => {
      const aPriority = a.sortPriority || 0;
      const bPriority = b.sortPriority || 0;

      if (aPriority === bPriority) {
         return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }
      return bPriority - aPriority;
   });
}

type ApiProductListSection = NonNullable<ApiProductList['sections']>[0];

function createProductListSection(
   section: ApiProductListSection
): ProductListSection | null {
   if (section == null) {
      return null;
   }
   switch (section.__typename) {
      case 'ComponentProductListBanner': {
         return {
            type: ProductListSectionType.Banner,
            id: section.id,
            title: section.title,
            description: section.description,
            callToActionLabel: section.callToActionLabel,
            url: section.url,
         };
      }
      case 'ComponentProductListRelatedPosts': {
         return {
            type: ProductListSectionType.RelatedPosts,
            id: section.id,
            tags: section.tags || null,
         };
      }
      case 'ComponentProductListFeaturedProductList': {
         const productList = section.productList?.data?.attributes;
         if (productList == null) {
            return null;
         }
         const image = productList.image?.data?.attributes;

         const algoliaApiKey = createPublicAlgoliaKey(
            ALGOLIA_APP_ID,
            ALGOLIA_API_KEY
         );

         return {
            type: ProductListSectionType.FeaturedProductList,
            id: section.id,
            productList: {
               handle: productList.handle,
               title: productList.title,
               deviceTitle: productList.deviceTitle ?? null,
               path: getProductListPath({
                  handle: productList.handle,
                  deviceTitle: productList.deviceTitle ?? null,
                  type: getProductListType(productList.type),
               }),
               description: productList.description,
               image:
                  image == null
                     ? null
                     : getImageFromStrapiImage(image, 'thumbnail'),
               filters: productList.filters ?? null,
               algolia: {
                  indexName: ALGOLIA_DEFAULT_INDEX_NAME,
                  apiKey: algoliaApiKey,
               },
            },
         };
      }
      case 'ComponentProductListLinkedProductListSet': {
         return {
            type: ProductListSectionType.ProductListSet,
            id: section.id,
            title: section.title,
            productLists: filterNullableItems(
               section.productLists?.data?.map((item) => {
                  const productList = item.attributes;
                  if (productList == null) {
                     return null;
                  }
                  const image = productList.image?.data?.attributes;
                  return {
                     handle: productList.handle,
                     title: productList.title,
                     deviceTitle: productList.deviceTitle ?? null,
                     path: getProductListPath({
                        handle: productList.handle,
                        deviceTitle: productList.deviceTitle ?? null,
                        type: getProductListType(productList.type),
                     }),
                     description: productList.description,
                     image:
                        image == null
                           ? null
                           : getImageFromStrapiImage(image, 'thumbnail'),
                     filters: productList.filters ?? null,
                  };
               })
            ),
         };
      }
      default: {
         console.warn(
            `Unknown product list section type: ${section.__typename}`
         );
         return null;
      }
   }
}

function createPublicAlgoliaKey(appId: string, apiKey: string): string {
   const client = algoliasearch(appId, apiKey);
   const publicKey = client.generateSecuredApiKey(apiKey, {
      filters: 'public=1 AND is_pro!=1',
   });
   return publicKey;
}
