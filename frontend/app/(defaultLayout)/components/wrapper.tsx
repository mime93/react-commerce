import { classNames } from '@helpers/ui-helpers';

export type WrapperProps = React.DetailedHTMLProps<
   React.HTMLAttributes<HTMLDivElement>,
   HTMLDivElement
>;

export function Wrapper({ className, ...other }: WrapperProps) {
   return (
      <div
         className={classNames(
            'w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
            className
         )}
         {...other}
      />
   );
}
