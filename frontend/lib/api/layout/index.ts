import { assertNever, Awaited, filterNullableItems } from '@lib/utils';
import { LayoutPropsFragment } from '../strapi/generated/sdk';
import { getImageFromStrapiImage, Image } from '../utils';
import snarkdown from 'snarkdown';

type StoreSettings = NonNullable<
   NonNullable<LayoutPropsFragment['currentStore']>[0]
>;

type Footer = NonNullable<StoreSettings['footer']>;

type RawMenu = NonNullable<Footer['menu1']>;

export type LayoutData = NonNullable<
   Awaited<ReturnType<typeof getLayoutProps>>
>['layout'];

export function getLayoutProps(data: LayoutPropsFragment) {
   const currentStore = data.currentStore?.[0];
   const footer = currentStore?.footer;
   const socialMediaAccounts = currentStore?.socialMediaAccounts || {};
   const stores = filterNullableItems(data.stores);
   return {
      layout: {
         footer: {
            menu1: footer?.menu1 ? getMenu(footer.menu1) : undefined,
            menu2: footer?.menu2 ? getMenu(footer.menu2) : undefined,
            partners: footer?.partners ? getMenu(footer.partners) : undefined,
            bottomMenu: footer?.bottomMenu
               ? getMenu(footer.bottomMenu)
               : undefined,
            socialMediaAccounts,
            stores,
         },
      },
   };
}

export interface Menu {
   items: MenuItem[];
}

export type MenuItem =
   | {
        type: 'link';
        name: string;
        url: string;
        descriptionHtml?: string;
     }
   | {
        type: 'linkWithImage';
        name: string;
        url: string;
        image?: Image;
     }
   | {
        type: 'productListLink';
        name: string;
        url: string;
     }
   | {
        type: 'submenu';
        name: string;
        submenu: Menu;
     };

function getMenu(rawMenu: RawMenu): Menu {
   return {
      items: filterNullableItems(
         rawMenu.items.map((item): MenuItem | null => {
            if (item == null) {
               return null;
            }
            switch (item.__typename) {
               case 'ComponentMenuLink': {
                  return {
                     type: 'link',
                     name: item.name,
                     url: item.url,
                     descriptionHtml: item.description
                        ? snarkdown(item.description)
                        : undefined,
                  };
               }
               case 'ComponentMenuLinkWithImage': {
                  return {
                     type: 'linkWithImage',
                     name: item.name,
                     url: item.url,
                     image:
                        getImageFromStrapiImage(item.image, 'small') ||
                        undefined,
                  };
               }
               case 'ComponentMenuProductListLink': {
                  return {
                     type: 'productListLink',
                     name: item.name,
                     url: item.productList
                        ? `/collections/${item.productList.handle}`
                        : '#',
                  };
               }
               case 'ComponentMenuSubmenu': {
                  if (item.submenu == null) {
                     return null;
                  }
                  return {
                     type: 'submenu',
                     name: item.name,
                     submenu: getMenu(item.submenu),
                  };
               }
               default:
                  return assertNever(item);
            }
         })
      ),
   };
}
