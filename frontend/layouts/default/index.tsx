import { Wordmark20th } from '@assets/svg/files';
import {
   Alert,
   AlertIcon,
   AlertTitle,
   Box,
   DrawerCloseButton,
   Flex,
   Icon,
   MenuDivider,
   MenuGroup,
   MenuList,
   Portal,
} from '@chakra-ui/react';
import { GoogleAnalytics, PiwikPro } from '@components/analytics';
import { SmartLink } from '@components/ui/SmartLink';
import { PIWIK_ENV, SHOPIFY_STOREFRONT_VERSION } from '@config/env';
import {
   faArrowRight,
   faBell,
   faBox,
   faMagnifyingGlass,
   faRightFromBracket,
   faScrewdriverWrench,
   faUser,
   faUsers,
} from '@fortawesome/pro-solid-svg-icons';
import {
   trackPiwikPreferredLanguage,
   trackPiwikPreferredStore,
   trackPiwikUserPrivilege,
} from '@ifixit/analytics';
import { useAppContext } from '@ifixit/app';
import { useAuthenticatedUser } from '@ifixit/auth-sdk';
import { FaIcon } from '@ifixit/icons';
import type { Menu } from '@ifixit/menu';
import { ShopifyStorefrontProvider } from '@ifixit/shopify-storefront-client';
import {
   CartDrawer,
   Header,
   HeaderBar,
   HeaderCloseHiddenBarButton,
   HeaderHiddenBar,
   HeaderNavigationToggleButton,
   HeaderOpenHiddenBarButton,
   HeaderPrimaryNavigation,
   HeaderSearchForm,
   HeaderSecondaryNavigation,
   NavigationAccordion,
   NavigationAccordionButton,
   NavigationAccordionItem,
   NavigationAccordionLink,
   NavigationAccordionPanel,
   NavigationAccordionSubItem,
   NavigationDrawer,
   NavigationMenu,
   NavigationMenuButton,
   NavigationMenuItem,
   NavigationSubmenu,
   NavigationSubmenuDescription,
   NavigationSubmenuDivider,
   NavigationSubmenuItem,
   NavigationSubmenuLink,
   NavigationSubmenuName,
   NoUserLink,
   SearchInput,
   UserMenu,
   UserMenuButton,
   UserMenuHeading,
   MenuItemIcon,
   UserMenuLink,
   WordmarkLink,
   useHeaderContext,
} from '@ifixit/ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { CartFooter } from './Footer';
import { LayoutErrorBoundary } from './LayoutErrorBoundary';
import type { DefaultLayoutProps } from './server';

const DefaultLayoutComponent = function ({
   title,
   includeTitle = true,
   stores,
   currentStore,
   shopifyCredentials,
   globalSettings,
   children,
}: React.PropsWithChildren<DefaultLayoutProps>) {
   const { menu } = currentStore.header;
   const mobileSearchInputRef = React.useRef<HTMLInputElement>(null);
   const { adminMessage } = useAppContext();
   const userData = useAuthenticatedUser().data;
   const isAdminUser = userData?.isAdmin ?? false;

   trackPiwikPreferredStore(PIWIK_ENV);
   trackPiwikPreferredLanguage(PIWIK_ENV, userData?.langid ?? null);
   trackPiwikUserPrivilege(PIWIK_ENV, userData?.privileges ?? null);
   return (
      <LayoutErrorBoundary>
         <ShopifyStorefrontProvider
            shopDomain={shopifyCredentials.storefrontDomain}
            storefrontAccessToken={shopifyCredentials.storefrontAccessToken}
            apiVersion={SHOPIFY_STOREFRONT_VERSION}
         >
            <Box>
               <Head>
                  {includeTitle && (
                     <title key="title">{title || 'iFixit'}</title>
                  )}
                  <link
                     rel="apple-touch-icon"
                     sizes="57x57"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-57x57.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="60x60"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-60x60.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="72x72"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-72x72.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="76x76"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-76x76.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="114x114"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-114x114.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="120x120"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-120x120.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="144x144"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-144x144.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="152x152"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-152x152.png"
                  />
                  <link
                     rel="apple-touch-icon"
                     sizes="180x180"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/apple-touch-icon-180x180.png"
                  />
                  <link
                     rel="icon"
                     type="image/png"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/favicon-32x32.png"
                     sizes="32x32"
                  />
                  <link
                     rel="icon"
                     type="image/png"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/android-chrome-192x192.png"
                     sizes="192x192"
                  />
                  <link
                     rel="icon"
                     type="image/png"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/favicon-96x96.png"
                     sizes="96x96"
                  />
                  <link
                     rel="icon"
                     type="image/png"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/favicon-16x16.png"
                     sizes="16x16"
                  />
                  <link
                     rel="manifest"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/manifest.json"
                  />
                  <link
                     rel="mask-icon"
                     href="https://assets.cdn.ifixit.com/static/icons/ifixit/safari-pinned-tab.svg"
                     color="#5bbad5"
                  />
               </Head>
               <Flex direction="column" minH="100vh">
                  <Header>
                     <HeaderHiddenBar>
                        <HeaderSearchForm.Mobile>
                           <SearchInput ref={mobileSearchInputRef} />
                        </HeaderSearchForm.Mobile>
                        <HeaderCloseHiddenBarButton>
                           Cancel
                        </HeaderCloseHiddenBarButton>
                     </HeaderHiddenBar>
                     <HeaderBar>
                        <HeaderPrimaryNavigation>
                           <HeaderNavigationToggleButton aria-label="Open navigation menu" />
                           <WordmarkLink
                              href="/"
                              aria-label="Go to homepage"
                              pr="4"
                              title="iFixit turns 20"
                              padding={0}
                           >
                              <Icon
                                 as={Wordmark20th}
                                 width="auto"
                                 height="100%"
                              />
                           </WordmarkLink>
                           {menu && (
                              <NavigationMenu>
                                 {menu.items.map((item, index) => {
                                    switch (item.type) {
                                       case 'submenu': {
                                          if (item.submenu === null) {
                                             return null;
                                          }
                                          return (
                                             <NavigationMenuItem key={index}>
                                                <NavigationMenuButton>
                                                   {item.name}
                                                </NavigationMenuButton>
                                                <NavigationSubmenu>
                                                   {item.submenu.items.map(
                                                      (subitem, subIndex) => {
                                                         if (
                                                            subitem.type !==
                                                            'link'
                                                         ) {
                                                            return null;
                                                         }
                                                         return (
                                                            <NavigationSubmenuItem
                                                               key={subIndex}
                                                            >
                                                               <SmartLink
                                                                  as={
                                                                     NavigationSubmenuLink
                                                                  }
                                                                  href={
                                                                     subitem.url
                                                                  }
                                                                  behaviour={
                                                                     subitem.url ===
                                                                     '/Store'
                                                                        ? 'reload'
                                                                        : 'auto'
                                                                  }
                                                                  disclosureIcon={
                                                                     <FaIcon
                                                                        icon={
                                                                           faArrowRight
                                                                        }
                                                                        h="5"
                                                                        transform="translateY(-50%)"
                                                                        color="white"
                                                                     />
                                                                  }
                                                               >
                                                                  <NavigationSubmenuName>
                                                                     {
                                                                        subitem.name
                                                                     }
                                                                  </NavigationSubmenuName>
                                                                  <NavigationSubmenuDivider />
                                                                  {subitem.description && (
                                                                     <NavigationSubmenuDescription>
                                                                        {
                                                                           subitem.description
                                                                        }
                                                                     </NavigationSubmenuDescription>
                                                                  )}
                                                               </SmartLink>
                                                            </NavigationSubmenuItem>
                                                         );
                                                      }
                                                   )}
                                                </NavigationSubmenu>
                                             </NavigationMenuItem>
                                          );
                                       }
                                       default: {
                                          return null;
                                       }
                                    }
                                 })}
                              </NavigationMenu>
                           )}
                        </HeaderPrimaryNavigation>
                        <HeaderSearchForm.Desktop>
                           <SearchInput />
                        </HeaderSearchForm.Desktop>
                        <HeaderSecondaryNavigation>
                           <HeaderOpenHiddenBarButton
                              aria-label="Search database"
                              _hover={{ opacity: '0.7' }}
                              transition="0.3s"
                              _active={{
                                 bg: 'gray.900',
                              }}
                              icon={
                                 <FaIcon
                                    icon={faMagnifyingGlass}
                                    h="22px"
                                    color="white"
                                 />
                              }
                              onClick={() => {
                                 mobileSearchInputRef.current?.focus();
                              }}
                           />
                           <CartDrawer />
                           <HeaderUserMenu />
                        </HeaderSecondaryNavigation>
                     </HeaderBar>
                     {menu && <LayoutNavigationDrawer menu={menu} />}
                  </Header>
                  {isAdminUser && adminMessage && (
                     <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>{adminMessage}</AlertTitle>
                     </Alert>
                  )}
                  {children}
                  <CartFooter
                     partners={currentStore.footer.partners}
                     bottomMenu={currentStore.footer.bottomMenu}
                     socialMediaAccounts={currentStore.socialMediaAccounts}
                     menu1={currentStore.footer.menu1}
                     menu2={currentStore.footer.menu2}
                     menu3={currentStore.footer.menu3}
                     stores={stores}
                     globalSettings={globalSettings}
                  />
               </Flex>
            </Box>
            <GoogleAnalytics />
            <PiwikPro />
         </ShopifyStorefrontProvider>
      </LayoutErrorBoundary>
   );
};

interface LayoutNavigationDrawerProps {
   menu: Menu;
}

function LayoutNavigationDrawer({ menu }: LayoutNavigationDrawerProps) {
   const headerContext = useHeaderContext();
   const router = useRouter();

   React.useEffect(() => {
      headerContext.navigation.close();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [router.asPath]);

   return (
      <NavigationDrawer>
         <DrawerCloseButton />
         <WordmarkLink
            href="/"
            aria-label="Go to homepage"
            mb="8"
            title="iFixit turns 20"
            padding={0}
         >
            <Icon as={Wordmark20th} width="auto" height="100%" />
         </WordmarkLink>
         <NavigationAccordion>
            {menu.items.map((item, index) => {
               switch (item.type) {
                  case 'submenu': {
                     if (item.submenu === null) {
                        return null;
                     }
                     return (
                        <NavigationAccordionItem key={index}>
                           <NavigationAccordionButton>
                              {item.name}
                           </NavigationAccordionButton>
                           <NavigationAccordionPanel>
                              {item.submenu.items.map((subitem, subIndex) => {
                                 if (subitem.type !== 'link') {
                                    return null;
                                 }
                                 return (
                                    <NavigationAccordionSubItem key={subIndex}>
                                       <SmartLink
                                          as={NavigationAccordionLink}
                                          href={subitem.url}
                                       >
                                          {subitem.name}
                                       </SmartLink>
                                    </NavigationAccordionSubItem>
                                 );
                              })}
                           </NavigationAccordionPanel>
                        </NavigationAccordionItem>
                     );
                  }
                  default: {
                     return null;
                  }
               }
            })}
         </NavigationAccordion>
      </NavigationDrawer>
   );
}

function HeaderUserMenu() {
   const user = useAuthenticatedUser();
   const appContext = useAppContext();

   if (user.data == null) {
      return <NoUserLink href={`${appContext.ifixitOrigin}/Login`} />;
   }

   const notificationsCount = user.data.unread_notification_count ?? 0;

   return (
      <UserMenu user={user.data}>
         <UserMenuButton
            aria-label="Open user menu"
            hasUnreadNotifications={notificationsCount > 0}
         />
         <Portal>
            <MenuList minW="240px">
               <UserMenuHeading />
               <MenuDivider />
               <MenuGroup>
                  <UserMenuLink
                     href={`${appContext.ifixitOrigin}/User/Notifications/${user.data.id}/${user.data.username}`}
                  >
                     <Flex justify="space-between" align="center" w="full">
                        <Flex align="center">
                           <MenuItemIcon icon={faBell} />
                           <span>Notifications</span>
                        </Flex>
                        <NotificationCountBadge count={notificationsCount} />
                     </Flex>
                  </UserMenuLink>
                  <UserMenuLink
                     href={`${appContext.ifixitOrigin}/User/${user.data.id}/${user.data.username}`}
                  >
                     <MenuItemIcon icon={faUser} />
                     <span>View Profile</span>
                  </UserMenuLink>
                  {user.data.teams.length > 0 && (
                     <UserMenuLink href={`${appContext.ifixitOrigin}/Team`}>
                        <MenuItemIcon icon={faUsers} />
                        <span>My Team</span>
                     </UserMenuLink>
                  )}
                  <UserMenuLink href={`${appContext.ifixitOrigin}/User/Orders`}>
                     <MenuItemIcon icon={faBox} />
                     <span>Orders</span>
                  </UserMenuLink>
                  {user.data.links.manage && (
                     <UserMenuLink
                        href={`${appContext.ifixitOrigin}${user.data.links.manage}`}
                     >
                        <MenuItemIcon icon={faScrewdriverWrench} />
                        <span>Manage</span>
                     </UserMenuLink>
                  )}
               </MenuGroup>
               <MenuDivider />
               <MenuGroup>
                  <UserMenuLink
                     href={`${appContext.ifixitOrigin}/Guide/logout`}
                  >
                     <MenuItemIcon icon={faRightFromBracket} />
                     <span>Log Out</span>
                  </UserMenuLink>
               </MenuGroup>
            </MenuList>
         </Portal>
      </UserMenu>
   );
}

interface NotificationCountBadgeProps {
   count: number;
}

function NotificationCountBadge({ count }: NotificationCountBadgeProps) {
   if (count === 0) return null;
   return (
      <Flex
         rounded="full"
         bgColor="brand.500"
         h="18px"
         minW="18px"
         justify="center"
         align="center"
         fontSize="xs"
         fontWeight="semibold"
         color="white"
         p="1"
      >
         {count > 100 ? '100+' : count}
      </Flex>
   );
}

export const DefaultLayout = DefaultLayoutComponent;
