// import { AddToCartInput, CartLineItem } from '@ifixit/cart-sdk';
import { gaSendEvent, trackGoogleAddToCart } from './google';
import { trackMatomoCartChange } from './matomo';
import { TrackEventMatomo, trackInMatomo } from './matomo/track-event';

export * from './google';
export * from './matomo';

/**
 * @param trackData trackData.eventName will default to the page path if not provided
 */
export const trackInMatomoAndGA = (trackData: TrackEventMatomo) => {
   if (typeof window === 'undefined') {
      return;
   }
   const eventName =
      trackData.eventName ||
      `${window.location.origin}${window.location.pathname}`;
   trackInMatomo({
      ...trackData,
      eventName,
   });
   gaSendEvent({
      category: trackData.eventCategory,
      action: trackData.eventAction,
      name: eventName,
   });
};

export function trackAddToCart(
   // cart: CartLineItem[],
   // addToCartInput: AddToCartInput,
   cart: any,
   addToCartInput: any,
   eventSpecification?: string
) {
   if (typeof window === 'undefined') {
      return;
   }
   trackMatomoCartChange(cart);
   trackGoogleAddToCart(addToCartInput);
   const event =
      `Add to Cart` + (eventSpecification ? ` - ${eventSpecification}` : '');
   const itemcodes =
      addToCartInput.type === 'product'
         ? addToCartInput.product.itemcode
         : `${addToCartInput.bundle.currentItemCode}/` +
           `${addToCartInput.bundle.items
              .map((item: any) => item.itemcode)
              .join(', ')}`;
   trackInMatomoAndGA({
      eventCategory: event,
      eventAction: `${event} - ${itemcodes}`,
      eventName: `${window.location.origin}${window.location.pathname}`,
   });
}
