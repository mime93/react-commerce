import { HStack, ResponsiveValue, StackProps } from '@chakra-ui/react';
import { faStarHalf } from '@fortawesome/pro-duotone-svg-icons';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FaIcon, FaIconProps } from '@ifixit/icons';

export interface RatingProps extends StackProps {
   value?: number;
   size?: ResponsiveValue<string | number>;
}

const stars = new Array(5).fill(null).map((_, index) => index + 1);

export function Rating(props: RatingProps) {
   const { value = 5, ...rest } = props;

   const halfStarsValue = Math.round(value * 2);

   return (
      <HStack spacing="1" {...rest}>
         {stars.map((i) => {
            let appearance = RatingStarVariant.Empty;
            if (halfStarsValue >= i * 2) {
               appearance = RatingStarVariant.Full;
            } else if (halfStarsValue >= i * 2 - 1) {
               appearance = RatingStarVariant.Half;
            }
            return (
               <RatingStar key={i} size={props.size} variant={appearance} />
            );
         })}
      </HStack>
   );
}

type RatingStarProps = Omit<FaIconProps, 'icon'> & {
   variant: RatingStarVariant;
   size?: ResponsiveValue<string | number>;
};

export enum RatingStarVariant {
   Full = 'full',
   Half = 'half',
   Empty = 'empty',
}

export const RatingStar = ({
   variant = RatingStarVariant.Empty,
   size = '4',
   ...otherProps
}: RatingStarProps) => {
   switch (variant) {
      case RatingStarVariant.Empty: {
         return (
            <FaIcon icon={faStar} h={size} color="gray.300" {...otherProps} />
         );
      }
      case RatingStarVariant.Full: {
         return (
            <FaIcon icon={faStar} h={size} color="brand.500" {...otherProps} />
         );
      }
      case RatingStarVariant.Half: {
         return (
            <FaIcon
               icon={faStarHalf}
               h={size}
               sx={{
                  '--fa-primary-color': 'var(--chakra-colors-brand-500)',
                  '--fa-secondary-color': 'var(--chakra-colors-gray-300)',
                  '--fa-secondary-opacity': '1',
               }}
               {...otherProps}
            />
         );
      }
   }
};
