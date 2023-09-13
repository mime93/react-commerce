'use client';

import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import { type FormEventHandler } from 'react';

export function SearchForm({ children }: React.PropsWithChildren<{}>) {
   const router = useRouter();

   const search = debounce((searchParams: URLSearchParams) => {
      router.push(`?${searchParams.toString()}`);
   }, 50);

   const onInput: FormEventHandler<HTMLFormElement> = (event) => {
      const formData = new FormData(event.currentTarget);
      if (formData.get('q')?.length === 0) {
         formData.delete('q');
      }
      for (const [key, value] of formData.entries() as any) {
         if (value === '') {
            formData.delete(key);
         }
      }
      const searchParams = new URLSearchParams(formData as any);
      // console.log('FORM INPUT', searchParams.toString());
      // router.push(`?${searchParams.toString()}`);
      search(searchParams);
   };

   return (
      <form method="get" onInput={onInput} className="w-full">
         {children}
      </form>
   );
}
