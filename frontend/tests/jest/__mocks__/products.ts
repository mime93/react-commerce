import { MenuItemType } from '@ifixit/menu';
import type { ProductVariant } from '@pages/api/nextjs/cache/product';
import type { ProductSearchHit } from '@models/product-list';
import type { ProductReview } from '@models/product/reviews';
import type { ProductTemplateProps } from '@templates/product/hooks/useProductTemplateProps';

export const mockedProductVariant: ProductVariant = {
   id: 'gid://shopify/ProductVariant/32965718147162',
   sku: 'IF315-007-10',
   quantityAvailable: 63,
   image: {
      id: 'gid://shopify/ProductImage/31263941197914',
      altText: 'iPhone 6s Plus Battery New Fix Kit',
      height: 2000,
      width: 2000,
      url: 'https://cdn.shopify.com/s/files/1/2429/5121/products/WNVDn4lvaMJpK33F.jpg?v=1656545132',
      variantId: 'gid://shopify/ProductVariant/32965718147162',
   },
   price: {
      amount: 23.99,
      currencyCode: 'USD',
   },
   compareAtPrice: {
      amount: 29.99,
      currencyCode: 'USD',
   },
   proPricesByTier: {
      pro_1: {
         amount: 29.99,
         currencyCode: 'USD',
      },
      pro_2: {
         amount: 29.99,
         currencyCode: 'USD',
      },
      pro_3: {
         amount: 29.99,
         currencyCode: 'USD',
      },
      pro_4: {
         amount: 29.99,
         currencyCode: 'USD',
      },
   },
   selectedOptions: [
      {
         name: 'Condition',
         value: 'New',
      },
      {
         name: 'Part or Kit',
         value: 'Fix Kit',
      },
   ],
   description:
      '<p>This replacement battery is what you need to bring that dead smartphone back to life. The Fix Kit includes everything you need to swap in a new replacement battery.</p>\n\n<ul><li>This battery is brand new! Each one has been tested to confirm that there are no cycles on the cell and that the capacity is 95% or higher.</li><li>Make disassembly for future repairs easier, replace your pentalobe bottom screws with the Phillips screws included in the kit.</li></ul>',
   kitContents:
      '<ul><li>New Replacement Battery Compatible with iPhone 6s Plus with Adhesive Strips Preinstalled</li><li><a href="/products/iphone-6s-plus-display-assembly-adhesive">iPhone 6s Plus Display Assembly Adhesive</a></li><li><a href="/products/spudger">Spudger</a></li><li><a href="/products/suction-handle">Suction Handle</a></li><li><a href="/products/tweezers">Tweezers / Angled / Pro / ESD</a></li><li><a href="/products/ifixit-opening-tool">iFixit Opening Tool</a></li><li>Replacement Phillips Bottom Screws</li><li><a href="/products/ifixit-precision-bit-driver">Precision Bit Driver</a></li><li><a href="/products/ifixit-precision-4-mm-screwdriver-bit">4 mm Precision Bits</a>:<ul><li>Phillips #000</li><li>Pentalobe P2</li><li>Tri-point Y000</li></ul></li></ul>',
   assemblyContents: null,
   note: '<p>For optimal performance, calibrate your newly installed battery: Charge it to 100% and keep charging it for at least 2 more hours. Then use your device until it shuts off due to low battery. Finally, charge it uninterrupted to 100%.</p>',
   disclaimer:
      '<p>While not necessary, some fixers prefer to use additional tools to accomplish this repair: <a href="/products/iopener">iOpener</a> and <a href="/products/plastic-cards">Plastic Card</a>.</p>',
   warning:
      '<p><a href="https://mmcelvain.cominor.com/Wiki/What_to_do_with_a_swollen_battery" target="_blank">Learn more</a> about safe lithium-ion battery handling and proper disposal.</p>',
   specifications:
      "<table class='specifications'><tr><th>Part #</th><td>616-00045</td></tr>\n<tr><th>Watt Hours</th><td>10.45 Wh</td></tr>\n<tr><th>Voltage</th><td>3.8 V</td></tr>\n<tr><th>Milliamp Hours</th><td>2750 mAh</td></tr>\n<tr><th>Manufacturer</th><td>Aftermarket</td></tr></table>",
   warranty: 'One year warranty',
   enabled: true,
   disableWhenOOS: false,
   internalDisplayName: 'iPhone 6s Plus Battery / Fix Kit with Adhesive',
   shippingRestrictions: ['is_battery'],
   productcode: '315007',
   optionid: '10',
   isDiscounted: true,
   discountPercentage: 20,
   title: 'New / Fix Kit',
   crossSellVariantIds: [
      'gid://shopify/ProductVariant/32965720473690',
      'gid://shopify/ProductVariant/32965720178778',
   ],
};

export const mockedProductSearchHit: ProductSearchHit = {
   sku: 'IF-313-1233',
   category: ['Batteries'],
   description:
      'Replace a dead or malfunctioning model EB-BG965ABE battery in a Samsung Galaxy S9 Plus smartphone.',
   device: [
      'Samsung Galaxy S9 Plus',
      'Samsung Galaxy Phone S',
      'Samsung Android Phone',
      'Android Phone',
      'Phone',
   ],
   doctype: 'product_group',
   facet_tags: {
      'Device Type': 'Galaxy S',
      'Device Brand': 'Samsung',
      OS: 'Android',
      'Device Category': 'Phone',
      'Part or Kit': ['Fix Kit', 'Part Only'],
      'Item Type': 'Batteries',
      'Main Category': 'Parts',
      Price: [36.99, 41.99, 29.99, 23.99],
   },
   group_max_price: 4199,
   group_min_price: 2999,
   handle: 'galaxy-s9-plus-replacement-battery',
   has_image: 1,
   identifiers: [
      '404-007',
      '404007',
      'IF404-007',
      'IF404007',
      '404-007-3',
      '404-007-4',
      '404-007-1',
      '404-007-2',
      '404007-3',
      '404007-4',
      '404007-1',
      '404007-2',
      'IF404-007-3',
      'IF404-007-4',
      'IF404-007-1',
      'IF404-007-2',
      'IF404007-3',
      'IF404007-4',
      'IF404007-1',
      'IF404007-2',
   ],
   image_url:
      'https://cart-products.cdn.ifixit.com/cart-products/iPbUhjTn6EYf1PTS.standard',
   is_pro: 0,
   keywords: [],
   lifetime_warranty: false,
   objectType: 'product_group',
   oem_partnership: null,
   price_float: 41.99,
   price_range: '$29 - $41',
   productcode: 404007,
   productid: 4040070000,
   public: 1,
   quantity_available: 10,
   rating: 4.5,
   rating_count: 18,
   score_product: 902,
   search_tags: [],
   short_description:
      'Replace a dead or malfunctioning model EB-BG96aasd5ABE battery in a Samsung Galaxy S9 Plus smartphone.',
   site: 'ifixit',
   title: 'Galaxy S9+ Battery',
   url: '/Store/Android/Galaxy-S9-Battery/IF404-007?o=4',
   worksin: [
      'Samsung Galaxy S9 Plus Canada (G965W)',
      'Samsung Galaxy S9 Plus China, Latin America (G9650)',
      'Samsung Galaxy S9 Plus Europe, Global Dual-SIM (G965F/DS)',
      'Samsung Galaxy S9 Plus Europe, Global Single-SIM (G965F)',
      'Samsung Galaxy S9 Plus USA (G965U)',
   ],
   objectID: '0000000002_product_group_4040070000_en',
   _highlightResult: {
      category: [
         {
            value: 'Batteries',
            matchLevel: 'none',
            matchedWords: [],
         },
      ],
      description: {
         value: 'Replace a dead or malfunctioning model EB-BG965ABE battery in a Samsung Galaxy S9 Plus smartphone.',
         matchLevel: 'none',
         matchedWords: [],
      },
      device: [
         {
            value: 'Samsung Galaxy S9 Plus',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Samsung Galaxy Phone S',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Samsung Android Phone',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Android Phone',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Phone',
            matchLevel: 'none',
            matchedWords: [],
         },
      ],
      identifiers: [
         {
            value: '404-007',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404007',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404-007',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404007',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404-007-3',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404-007-4',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404-007-1',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404-007-2',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404007-3',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404007-4',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404007-1',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: '404007-2',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404-007-3',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404-007-4',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404-007-1',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404-007-2',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404007-3',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404007-4',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404007-1',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'IF404007-2',
            matchLevel: 'none',
            matchedWords: [],
         },
      ],
      title: {
         value: 'Galaxy S9+ Battery',
         matchLevel: 'none',
         matchedWords: [],
      },
      worksin: [
         {
            value: 'Samsung Galaxy S9 Plus Canada (G965W)',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Samsung Galaxy S9 Plus China, Latin America (G9650)',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Samsung Galaxy S9 Plus Europe, Global Dual-SIM (G965F/DS)',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Samsung Galaxy S9 Plus Europe, Global Single-SIM (G965F)',
            matchLevel: 'none',
            matchedWords: [],
         },
         {
            value: 'Samsung Galaxy S9 Plus USA (G965U)',
            matchLevel: 'none',
            matchedWords: [],
         },
      ],
   },
   __position: 121,
};

export const mockedLayoutProps: Pick<ProductTemplateProps, 'layoutProps'> = {
   layoutProps: {
      globalSettings: {
         newsletterForm: {
            title: 'Stay in the loop',
            subtitle: 'Learn something new every month!',
            inputPlaceholder: 'Enter your email',
            callToActionButtonTitle: 'Subscribe',
         },
      },
      currentStore: {
         header: {
            menu: {
               title: 'US Main',
               items: [
                  {
                     type: MenuItemType.Submenu,
                     name: 'Fix Your Stuff',
                     submenu: {
                        title: 'Repair',
                        items: [
                           {
                              type: MenuItemType.Link,
                              name: 'Repair Guides',
                              url: 'https://www.ifixit.com/Guide',
                              description:
                                 'Learn how to fix just about anything with our step-by-step guides.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Answers Forum',
                              url: 'https://www.ifixit.com/Answers',
                              description:
                                 'Share solutions and get help from a friend.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Teardowns',
                              url: 'https://www.ifixit.com/Teardown',
                              description:
                                 'Get a sneak peek inside the latest gadgets.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Blog',
                              url: 'https://www.ifixit.com/News',
                              description:
                                 'Your destination for tech repair news.',
                           },
                        ],
                     },
                  },
                  {
                     type: MenuItemType.Submenu,
                     name: 'Community',
                     submenu: {
                        title: 'Community',
                        items: [
                           {
                              type: MenuItemType.Link,
                              name: 'Get Involved',
                              url: 'https://www.ifixit.com/Community',
                              description:
                                 'Help teach people to make their stuff work again.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Right to Repair',
                              url: 'https://www.ifixit.com/Right-to-Repair',
                              description:
                                 'Learn about the Right to Repair movement and how to be an advocate.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Repairability',
                              url: 'https://www.ifixit.com/Right-to-Repair/Repairable-Products',
                              description:
                                 'Learn why fixable products make sense.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Our Manifesto',
                              url: 'https://www.ifixit.com/Manifesto',
                              description: 'Join the repair revolution!',
                           },
                        ],
                     },
                  },
                  {
                     type: MenuItemType.Submenu,
                     name: 'Store',
                     submenu: {
                        title: 'US Store navigation',
                        items: [
                           {
                              type: MenuItemType.Link,
                              name: 'Featured',
                              url: '/Store',
                              description:
                                 'Quality parts and tools backed by our lifetime guarantee.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Tools',
                              url: '/Tools',
                              description:
                                 'Shop our wide selection of precision tools.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Parts',
                              url: '/Parts',
                              description:
                                 'Shop parts backed by our quality guarantee.',
                           },
                           {
                              type: MenuItemType.Link,
                              name: 'Fix Kits',
                              url: 'https://www.ifixit.com/Kits',
                              description:
                                 'Fix it the easy way with our all-in-one repair kits.',
                           },
                        ],
                     },
                  },
               ],
            },
         },
         footer: {
            partners: {
               title: 'US Partners',
               items: [
                  {
                     type: MenuItemType.ImageLink,
                     name: 'Apple Pay',
                     url: '/cart',
                     image: {
                        alternativeText: 'Apple pay.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Apple_pay_f3880a8a06.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Apple_pay_f3880a8a06.png',
                              name: 'thumbnail_Apple pay.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
                  {
                     type: MenuItemType.ImageLink,
                     name: 'Google Pay',
                     url: '/cart',
                     image: {
                        alternativeText: 'Google pay.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Google_pay_32cd2d40ef.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Google_pay_32cd2d40ef.png',
                              name: 'thumbnail_Google pay.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
                  {
                     type: MenuItemType.ImageLink,
                     name: 'PayPal',
                     url: '/cart',
                     image: {
                        alternativeText: 'Paypal.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Paypal_ae2326b8cd.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Paypal_ae2326b8cd.png',
                              name: 'thumbnail_Paypal.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
                  {
                     type: MenuItemType.ImageLink,
                     name: 'Visa',
                     url: '/cart',
                     image: {
                        alternativeText: 'Visa.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Visa_8931a93403.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Visa_8931a93403.png',
                              name: 'thumbnail_Visa.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
                  {
                     type: MenuItemType.ImageLink,
                     name: 'Mastercard',
                     url: '/cart',
                     image: {
                        alternativeText: 'Mastercard.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Mastercard_bd10aef2e0.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Mastercard_bd10aef2e0.png',
                              name: 'thumbnail_Mastercard.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
                  {
                     type: MenuItemType.ImageLink,
                     name: 'Discover',
                     url: '/cart',
                     image: {
                        alternativeText: 'Discover.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Discover_d997b5ef1e.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Discover_d997b5ef1e.png',
                              name: 'thumbnail_Discover.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
                  {
                     type: MenuItemType.ImageLink,
                     name: 'AMEX',
                     url: '/cart',
                     image: {
                        alternativeText: 'Amex.png',
                        url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/Amex_34591009eb.png',
                        formats: {
                           thumbnail: {
                              url: 'https://ifixit-strapi-uploads.s3.amazonaws.com/thumbnail_Amex_34591009eb.png',
                              name: 'thumbnail_Amex.png',
                              width: 245,
                              height: 98,
                           },
                        },
                     },
                  },
               ],
            },
            bottomMenu: {
               title: 'US Footer bottom',
               items: [
                  {
                     type: MenuItemType.Link,
                     name: 'Licensed under Creative Commons',
                     url: 'https://www.ifixit.com/Info/Licensing',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Privacy',
                     url: 'https://www.ifixit.com/Info/Privacy',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Legal',
                     url: 'https://www.ifixit.com/Info/Terms_of_Use',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Accessibility',
                     url: 'https://www.ifixit.com/Info/Accessibility',
                     description: null,
                  },
               ],
            },
            menu1: {
               title: 'iFixit',
               items: [
                  {
                     type: MenuItemType.Link,
                     name: 'About Us',
                     url: 'https://www.ifixit.com/Info/index',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Customer Support',
                     url: 'https://help.ifixit.com/',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Careers',
                     url: 'https://www.ifixit.com/Info/jobs',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Feedback',
                     url: 'https://meta.ifixit.com/',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Newsletter',
                     url: 'https://www.ifixit.com/Newsletter',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'API',
                     url: 'https://www.ifixit.com/api/2.0/doc',
                     description: null,
                  },
               ],
            },
            menu2: {
               title: 'Resources',
               items: [
                  {
                     type: MenuItemType.Link,
                     name: 'Press',
                     url: 'https://www.ifixit.com/Info/Media',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'News',
                     url: 'https://www.ifixit.com/News/all-categories',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Participate',
                     url: 'https://www.ifixit.com/Participate',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Pro Wholesale',
                     url: 'https://pro.ifixit.com',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Retail Locator',
                     url: 'https://www.ifixit.com/Retail',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'For Manufacturers',
                     url: 'https://www.ifixit.com/services',
                     description: null,
                  },
               ],
            },
            menu3: {
               title: 'Legal',
               items: [
                  {
                     type: MenuItemType.Link,
                     name: 'Accessibility',
                     url: 'https://www.ifixit.com/Info/Accessibility',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Privacy',
                     url: 'https://www.ifixit.com/Info/Privacy',
                     description: null,
                  },
                  {
                     type: MenuItemType.Link,
                     name: 'Terms',
                     url: 'https://www.ifixit.com/Info/Terms_of_Use',
                     description: null,
                  },
               ],
            },
         },
         socialMediaAccounts: {
            twitter: 'https://twitter.com/ifixit',
            tiktok: null,
            facebook: 'https://www.facebook.com/iFixit/',
            instagram: 'https://www.instagram.com/ifixit/',
            youtube: 'https://www.youtube.com/user/iFixitYourself',
            repairOrg: 'https://www.repair.org/',
         },
      },
      shopifyCredentials: {
         storefrontDomain: 'store.cominor.com',
         storefrontAccessToken: '',
      },
      stores: [
         {
            code: 'us',
            name: 'United States',
            url: 'https://www.ifixit.com/products/iphone-6s-plus-replacement-battery',
            currency: 'USD',
         },
         {
            code: 'eu',
            name: 'Europe',
            url: 'https://eustore.ifixit.com/products/iphone-6s-plus-replacement-battery',
            currency: 'EUR',
         },
         {
            code: 'test',
            name: 'Test',
            url: 'https://www.cominor.com/products/iphone-6s-plus-replacement-battery',
            currency: 'USD',
         },
      ],
   },
};

export const mockedReviews: ProductReview[] = [
   {
      reviewid: 37443,
      rating: 5,
      headline: 'Cool and useful at the same time',
      productName: 'Precision Cleaning Kit',
      productVariantName: 'New',
      body: 'As advertised and solved our problem.',
      date: '<time   title="Thu, 03 Nov 2022 04:19:46 -0700" datetime="2022-11-03T04:19:46-07:00">Nov 3, 2022</time>',
      created_date: 1667474386,
      modified_date: 1667474465,
      langid: 'en',
      author: {
         userid: 3081773,
         name: 'MARVIN STABLER',
         avatar:
            'https://www.cominor.com/static/images/avatars/User/ifixit/avatar-9.thumbnail',
         url: 'https://www.cominor.com/User/3081773/MARVIN+STABLER',
         canEdit: true,
      },
   },
   {
      reviewid: 37196,
      rating: 5,
      headline: null,
      productName: 'Precision Cleaning Kit',
      productVariantName: 'New',
      body: 'Absolutely amazing very hopeful for cleaning',
      date: '<time   title="Mon, 17 Oct 2022 05:33:22 -0700" datetime="2022-10-17T05:33:22-07:00">Oct 17, 2022</time>',
      created_date: 1666010002,
      modified_date: 1666010027,
      langid: 'en',
      author: {
         userid: 4188334,
         name: 'Tristan Johnson',
         avatar: 'https://www.cominor.com/igi/WAEVRfFYkudpZf61.thumbnail',
         url: 'https://www.cominor.com/User/4188334/Tristan+Johnson',
         canEdit: true,
      },
   },
   {
      reviewid: 35622,
      rating: 4,
      headline: null,
      productName: 'Precision Cleaning Kit',
      productVariantName: 'New',
      body: 'Gives you a lot of the necessities you would need to give items you are repairing a nice cleaning',
      date: '<time   title="Fri, 24 Jun 2022 07:51:29 -0700" datetime="2022-06-24T07:51:29-07:00">Jun 24, 2022</time>',
      created_date: 1656082289,
      modified_date: 1656082657,
      langid: 'en',
      author: {
         userid: 4145501,
         name: 'Quin',
         avatar: 'https://www.cominor.com/igi/m2cwXWJISrPR1k6T.thumbnail',
         url: 'https://www.cominor.com/User/4145501/Quin',
         canEdit: true,
      },
   },
   {
      reviewid: 37335,
      rating: 4,
      headline: null,
      productName: 'Precision Cleaning Kit',
      productVariantName: 'New',
      body: 'Amazing product',
      date: '<time   title="Wed, 26 Oct 2022 11:15:54 -0700" datetime="2022-10-26T11:15:54-07:00">Oct 26, 2022</time>',
      created_date: 1666808154,
      modified_date: 1666808154,
      langid: undefined,
      author: {
         userid: 4201790,
         name: 'donald perez',
         avatar:
            'https://www.cominor.com/static/images/avatars/User/ifixit/avatar-5.thumbnail',
         url: 'https://www.cominor.com/User/4201790/donald+perez',
         canEdit: true,
      },
   },
   {
      reviewid: 37175,
      rating: 4,
      headline: null,
      productName: 'Precision Cleaning Kit',
      productVariantName: 'New',
      body: undefined,
      date: '<time   title="Wed, 12 Oct 2022 15:28:05 -0700" datetime="2022-10-12T15:28:05-07:00">Oct 12, 2022</time>',
      created_date: 1665613685,
      modified_date: 1665613685,
      langid: undefined,
      author: {
         userid: 4174587,
         name: 'Mariano',
         avatar:
            'https://www.cominor.com/static/images/avatars/User/ifixit/avatar-9.thumbnail',
         url: 'https://www.cominor.com/User/4174587/Mariano',
         canEdit: true,
      },
   },
   {
      reviewid: 36735,
      rating: 5,
      headline: null,
      productName: 'Precision Cleaning Kit',
      productVariantName: 'New',
      body: undefined,
      date: '<time   title="Sat, 10 Sep 2022 10:34:03 -0700" datetime="2022-09-10T10:34:03-07:00">Sep 10, 2022</time>',
      created_date: 1662831243,
      modified_date: 1662831243,
      langid: undefined,
      author: {
         userid: 4181048,
         name: 'Melissa Goodwin',
         avatar:
            'https://www.cominor.com/static/images/avatars/User/ifixit/avatar-2.thumbnail',
         url: 'https://www.cominor.com/User/4181048/Melissa+Goodwin',
         canEdit: true,
      },
   },
];
