import { filterNullableItems } from '@helpers/application-helpers';
import {
   computeDiscountPercentage,
   invariant,
   parseItemcode,
} from '@ifixit/helpers';
import { timeAsync } from '@ifixit/stats';
import {
   FindProductQuery,
   getServerShopifyStorefrontSdk,
   ProductVariantCardFragment,
} from '@lib/shopify-storefront-sdk';
import shuffle from 'lodash/shuffle';
import { z, ZodError } from 'zod';
import { findStoreByCode } from '../store';
import {
   Breadcrumb,
   Product,
   ProductSchema,
   ProductVariant,
   ProductVariantCard,
   ProductVariantCardSchema,
   ProductVariantImage,
   ProductVariantSchema,
   ProPriceTiers,
} from './schema';

export type {
   Product,
   ProductImage,
   ProductVariant,
   ProductVariantImage,
} from './schema';

export type FindProductArgs = {
   handle: string;
   storeCode: string;
};

export async function findProduct({
   handle,
   storeCode,
}: FindProductArgs): Promise<Product | null> {
   const store = await findStoreByCode(storeCode);
   const { storefrontDomain, storefrontDelegateAccessToken } = store.shopify;
   invariant(
      storefrontDelegateAccessToken,
      `Storefront delegate access token not found for store "${storeCode}"`
   );
   const storefront = getServerShopifyStorefrontSdk({
      shopDomain: storefrontDomain,
      storefrontDelegateToken: storefrontDelegateAccessToken,
   });

   const response = await timeAsync('shopify_api.findProduct', () =>
      storefront.findProduct({
         handle,
      })
   );
   if (response.product == null) {
      return null;
   }
   const variants = getVariants(response.product);
   const activeVariants = variants.filter(isActiveVariant);

   const allImages = getFormattedImages(response.product);
   const activeImages = allImages.filter((image) =>
      isActiveImage(image, activeVariants)
   );
   const options = getOptions(response.product.options, activeVariants);

   const variantSku = variants.find((variant) => variant.sku != null)?.sku;
   if (variantSku == null) {
      console.warn(`No sku found for product "${handle}"`);
      return null;
   }
   const iFixitProductId = computeIFixitProductId(variantSku);

   const ratingCount = response.product?.reviewsCount?.value;

   let breadcrumbs = parseBreadcrumbsMetafieldValue(
      response.product.breadcrumbs?.value
   );
   breadcrumbs = breadcrumbsWithCurrentProductPage(
      breadcrumbs,
      response.product.title
   );

   return {
      ...response.product,
      breadcrumbs,
      iFixitProductId,
      productcode: parseItemcode(variantSku).productcode,
      images: activeImages,
      allImages,
      options,
      variants: activeVariants,
      allVariants: variants,
      isEnabled: activeVariants.length > 0,
      prop65WarningType: response.product.prop65WarningType?.value ?? null,
      prop65Chemicals: response.product.prop65Chemicals?.value ?? null,
      productVideos: response.product.productVideos?.value ?? null,
      productVideosJson: parseVideosJson(
         response.product.productVideosJson?.value ?? null
      ),
      faqs: parseFaqs(response.product.faqs?.value),
      replacementGuides: parseReplacementGuides(
         response.product.replacementGuides?.value
      ),
      featuredProductVariants: getFeaturedProductVariants(response.product),
      compatibility: parseCompatibility(response.product.compatibility?.value),
      metaTitle: response.product.metaTitle?.value ?? null,
      shortDescription: response.product.shortDescription?.value ?? null,
      rating: parseRating(response.product.rating?.value),
      reviewsCount: ratingCount ? parseInt(ratingCount) : null,
      oemPartnership: parseOemPartnership(
         response.product.oemPartnership?.value
      ),
      enabledDomains: parseEnabledDomains(
         response.product.enabledDomains?.value
      ),
      redirectUrl: response.product.redirectUrl?.value ?? null,
   };
}

type ShopifyApiProduct = NonNullable<FindProductQuery['product']>;

function getVariants(shopifyProduct: ShopifyApiProduct): ProductVariant[] {
   return shopifyProduct.variants.nodes.map((variant): ProductVariant => {
      const { crossSell, ...other } = variant;
      const isDiscounted =
         variant.compareAtPrice != null &&
         parseFloat(variant.compareAtPrice.amount) >
            parseFloat(variant.price.amount);
      const discountPercentage = isDiscounted
         ? computeDiscountPercentage(
              parseFloat(variant.price.amount) * 100,
              parseFloat(variant.compareAtPrice!.amount) * 100
           )
         : 0;
      const { productcode, optionid } = parseItemcode(String(variant.sku));
      return {
         ...other,
         productcode,
         optionid,
         price: ProductVariantCardSchema.shape.price.parse(variant.price),
         compareAtPrice: ProductVariantCardSchema.shape.compareAtPrice.parse(
            variant.compareAtPrice
         ),
         image: variant.image
            ? formatImage(variant.image, shopifyProduct)
            : null,
         proPricesByTier: parsePriceTiersMetafieldValue(
            variant.proPricesByTier?.value,
            variant.price.currencyCode
         ),
         isDiscounted,
         discountPercentage,
         description: variant.description?.value ?? null,
         kitContents: variant.kitContents?.value ?? null,
         assemblyContents: variant.assemblyContents?.value ?? null,
         note: variant.note?.value ?? null,
         disclaimer: variant.disclaimer?.value ?? null,
         warning: variant.warning?.value ?? null,
         specifications: variant.specifications?.value ?? null,
         warranty: variant.warranty?.value ?? null,
         crossSellVariants: getCrossSellVariants(variant),
         enabled: variant.enabled?.value === 'true',
         disableWhenOOS: variant.disableWhenOOS?.value === 'true',
         shippingRestrictions: parseShippingRestrictions(
            variant.shippingRestrictions?.value
         ),
         internalDisplayName: variant.internalDisplayName?.value ?? null,
      };
   });
}

function getFormattedImages(product: ShopifyApiProduct) {
   return product.images.nodes.map((image) => {
      return formatImage(image, product);
   });
}

type ShopifyApiImage = ShopifyApiProduct['images']['nodes'][0];

function formatImage(image: ShopifyApiImage, product: ShopifyApiProduct) {
   const linkedVariant = product.variants.nodes.find(
      (variant) => variant.sku === image.altText
   );
   let altText = product.title;
   if (linkedVariant != null) {
      altText += ` ${linkedVariant.title.replace(/\s*\/\s*/g, ' ')}`;
   }
   return { ...image, altText, variantId: linkedVariant?.id ?? null };
}

function isActiveImage(
   image: ProductVariantImage,
   activeVariants: ProductVariant[]
) {
   return (
      image.variantId == null ||
      activeVariants.some((variant) => variant.id === image.variantId)
   );
}

function isActiveVariant(variant: ProductVariant) {
   const quantityAvailable = variant.quantityAvailable ?? 0;
   return variant.enabled && (!variant.disableWhenOOS || quantityAvailable > 0);
}

function getOptions(
   shopifyOptions: NonNullable<FindProductQuery['product']>['options'],
   activeVariants: ReturnType<typeof getVariants>
) {
   return shopifyOptions.map((option) => ({
      ...option,
      values: option.values.filter((value) =>
         activeVariants.find((variant) =>
            variant.selectedOptions.find(
               (selectedOption) =>
                  selectedOption.name === option.name &&
                  selectedOption.value === value
            )
         )
      ),
   }));
}

function getCrossSellVariants(
   variant: NonNullable<FindProductQuery['product']>['variants']['nodes'][0]
): ProductVariantCard[] {
   const products =
      variant.crossSell?.references?.nodes.map(
         (node): ProductVariantCard | null => {
            if (node.__typename !== 'ProductVariant') {
               return null;
            }
            const variant = getProductVariantCard(node);
            const quantity = variant.quantityAvailable ?? 0;

            if (quantity > 0 && variant.enabled) {
               return variant;
            }
            return null;
         }
      ) ?? [];
   return filterNullableItems(products);
}

function getFeaturedProductVariants(
   shopifyProduct: NonNullable<FindProductQuery['product']>
) {
   const variants =
      shopifyProduct.featuredProductVariants?.references?.nodes.map((node) => {
         if (node.__typename !== 'ProductVariant') {
            return null;
         }
         return getProductVariantCard(node);
      }) ?? [];
   const featuredVariants = filterNullableItems(variants);
   return shuffle(featuredVariants).slice(0, 5);
}

function getProductVariantCard(
   fragment: ProductVariantCardFragment
): ProductVariantCard {
   return {
      ...fragment,
      price: ProductVariantCardSchema.shape.price.parse(fragment.price),
      compareAtPrice: ProductVariantCardSchema.shape.compareAtPrice.parse(
         fragment.price
      ),
      product: {
         ...fragment.product,
         rating: parseRatingMetafieldValue(fragment.product.rating?.value),
         reviewsCount: parseNumericMetafieldValue(
            fragment.product.reviewsCount?.value
         ),
         oemPartnership: fragment.product.oemPartnership?.value ?? null,
      },
      warranty: fragment.warranty?.value ?? null,
      proPricesByTier: parsePriceTiersMetafieldValue(
         fragment.proPricesByTier?.value,
         fragment.price.currencyCode
      ),
      enabled: fragment.enabled?.value === 'true',
   };
}

function parseFaqs(value: string | null | undefined) {
   if (value == null) {
      return [];
   }
   const faqs = JSON.parse(value);
   if (!Array.isArray(faqs)) {
      return [];
   }
   return filterNullableItems(
      faqs.map((faq) => {
         const question = faq?.question;
         const answer = faq?.answer;
         if (typeof question !== 'string' || typeof answer !== 'string') {
            return null;
         }
         return {
            question,
            answer,
         };
      })
   );
}

function parseBreadcrumbsMetafieldValue(value: string | null | undefined) {
   if (typeof value !== 'string') {
      return null;
   }
   const json = JSON.parse(value);
   const parsedValue = ProductSchema.shape.breadcrumbs.safeParse(json);
   if (parsedValue.success) {
      return parsedValue.data;
   }
   return null;
}

function breadcrumbsWithCurrentProductPage(
   breadcrumbs: Breadcrumb[] | null,
   productTitle: string
) {
   if (breadcrumbs == null) {
      return null;
   }
   if (breadcrumbs.length > 0) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      if (lastBreadcrumb.label.toLowerCase() !== productTitle.toLowerCase()) {
         return breadcrumbs.concat([
            {
               label: productTitle,
               url: '#',
            },
         ]);
      }
   }
   return breadcrumbs;
}

function parseReplacementGuides(value: string | null | undefined) {
   if (value == null) {
      return [];
   }
   const rawJson = JSON.parse(value);
   if (!Array.isArray(rawJson)) {
      return [];
   }
   const guides = rawJson.map((item, index) => {
      const result = ProductSchema.shape.replacementGuides.element.safeParse({
         id: String(index),
         ...item,
      });
      if (result.success) {
         return result.data;
      }
      logParseErrors(result.error, 'replacement guide');
      return null;
   });
   return filterNullableItems(guides);
}

function parseCompatibility(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const rawJson = JSON.parse(value);
   if (rawJson == null) {
      return null;
   }
   const result = ProductSchema.shape.compatibility.safeParse(rawJson);
   if (result.success) {
      return result.data;
   }
   logParseErrors(result.error, 'compatibility metafield');
   return null;
}

function parseOemPartnership(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const rawJson = JSON.parse(value);
   if (rawJson == null) {
      return null;
   }
   const result = ProductSchema.shape.oemPartnership.safeParse(rawJson);
   if (result.success) {
      return result.data;
   }
   logParseErrors(result.error, 'oem partnership metafield');
   return null;
}

function parseEnabledDomains(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const rawJson = JSON.parse(value);
   if (rawJson == null) {
      return null;
   }
   const result = ProductSchema.shape.enabledDomains.safeParse(rawJson);
   if (result.success) {
      return result.data;
   }
   logParseErrors(result.error, 'enabled domains metafield');
   return null;
}

function computeIFixitProductId(variantSku: string) {
   return variantSku.split('-').slice(0, 2).join('-');
}

function parseRatingMetafieldValue(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const rating = JSON.parse(value);
   return rating.value != null ? parseFloat(rating.value) : null;
}

function parseNumericMetafieldValue(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   return value != null ? parseFloat(value) : null;
}

const PriceTiersMetafieldSchema = z.record(z.number());

function parsePriceTiersMetafieldValue(
   value: string | null | undefined,
   currencyCode: string
): ProPriceTiers | null {
   if (value == null) {
      return null;
   }
   const json: unknown = JSON.parse(value);
   if (json == null) {
      return null;
   }
   const result = PriceTiersMetafieldSchema.safeParse(json);
   if (result.success) {
      return Object.keys(result.data).reduce((acc, key) => {
         const amount = result.data[key];
         return {
            ...acc,
            [key]: {
               amount,
               currencyCode,
            },
         };
      }, {} as ProPriceTiers);
   }
   logParseErrors(result.error, 'price tiers metafield');
   return null;
}

function parseShippingRestrictions(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const json: unknown = JSON.parse(value);
   if (json == null) {
      return null;
   }
   const result =
      ProductVariantSchema.shape.shippingRestrictions.safeParse(json);
   if (result.success) {
      return result.data;
   }
   logParseErrors(result.error, 'shipping restricitions metafield');
   return null;
}

function parseVideosJson(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const json: unknown = JSON.parse(value);
   if (json == null) {
      return null;
   }
   const result = ProductSchema.shape.productVideosJson.safeParse(json);
   if (result.success) {
      return result.data;
   }
   logParseErrors(result.error, 'product_videos_json metafield');
   return null;
}

function parseRating(value: string | null | undefined) {
   if (value == null) {
      return null;
   }
   const json: unknown = JSON.parse(value);
   if (json == null) {
      return null;
   }
   const result = ProductSchema.shape.rating.safeParse(json);
   if (result.success) {
      return result.data;
   }
   logParseErrors(result.error, 'rating metafield');
   return null;
}

function logParseErrors(error: ZodError, typeName: string): void {
   const errors = error.flatten();
   console.error(
      `Failed to parse shipping ${typeName}:\n ${JSON.stringify(
         errors.fieldErrors,
         null,
         2
      )}`
   );
}
