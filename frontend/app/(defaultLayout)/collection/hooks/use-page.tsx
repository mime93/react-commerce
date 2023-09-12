import { useSearchParams } from 'next/navigation';

interface UsePageOptions {
   paramName?: string;
}

export function usePage({ paramName = 'p' }: UsePageOptions = {}) {
   const searchParams = useSearchParams();
   const page = searchParams?.get(paramName);
   return page?.match(/\d+/) ? parseInt(page) : 1;
}
