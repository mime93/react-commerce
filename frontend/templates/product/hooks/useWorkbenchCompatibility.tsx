import type { Product } from '@pages/api/nextjs/cache/product';
import { IFixitAPIClient } from '@ifixit/ifixit-api-client';
import { IFIXIT_ORIGIN } from '@config/env';
import {
   PropsWithChildren,
   createContext,
   useContext,
   useEffect,
   useState,
} from 'react';

export interface CompatibilityData {
   dropdownTopicVariants: any[];
   activeTopicWikiid: number;
   dropdownTopics: DropdownTopic[];
}

export interface DropdownTopic {
   label: string;
   value: string;
   isCompatible: string;
}

const emptyCompatibilityData: CompatibilityData = {
   dropdownTopicVariants: [],
   activeTopicWikiid: 0,
   dropdownTopics: [],
};

export function useWorkbenchCompatibility({
   productid,
}: {
   productid: Product['id'];
}) {
   const [compatData, setCompatData] = useState(emptyCompatibilityData);

   useEffect(() => {
      const isValid = /^\d{6}$/.test(productid);
      if (!isValid) {
         console.warn(
            'productid must be a string of numbers only. No optionid allowed.',
            productid
         );
         return;
      }

      const client = new IFixitAPIClient({
         origin: IFIXIT_ORIGIN,
      });

      const url = `store/user/workbench_compatibility/${productid}`;
      client
         .get<CompatibilityData>(url, 'workbench_compatibility')
         .then((data) => setCompatData(data))
         .catch(() => setCompatData(emptyCompatibilityData));
   }, [productid]);

   return compatData;
}

type WorkbenchCompatibilityContextValue = CompatibilityData & {
   selectedTopic: DropdownTopic | null;
   setSelectedTopic: (topic: DropdownTopic | null) => void;
};

const WorkbenchCompatibilityContext =
   createContext<WorkbenchCompatibilityContextValue | null>(null);
export function useWorkbenchCompatibilityContext() {
   const context = useContext(WorkbenchCompatibilityContext);
   if (!context) {
      throw new Error(
         'useWorkbenchCompatibilityContext must be used within a WorkbenchCompatibilityContext'
      );
   }
   return context;
}

export function WorkbenchCompatibilityProvider({
   productid,
   children,
}: PropsWithChildren<{ productid: string }>) {
   const compatData = useWorkbenchCompatibility({ productid });
   const [selectedTopic, setSelectedTopic] = useState<DropdownTopic | null>(
      null
   );
   useEffect(() => {
      if (compatData.dropdownTopics.length === 0) {
         return;
      }

      const firstCompatibleTopic = compatData.dropdownTopics.find(
         (topic) => topic.isCompatible === 'true'
      );

      setSelectedTopic(firstCompatibleTopic || compatData.dropdownTopics[0]);
   }, [compatData]);

   const context = {
      ...compatData,
      selectedTopic,
      setSelectedTopic,
   };

   return (
      <WorkbenchCompatibilityContext.Provider value={context}>
         {children}
      </WorkbenchCompatibilityContext.Provider>
   );
}
