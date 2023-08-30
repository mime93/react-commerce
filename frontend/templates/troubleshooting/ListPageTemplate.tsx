'use client';

import { Heading } from '@chakra-ui/react';

export type TemplateProps = {
   device: string;
   id: string;
};

export default function ListPageTemplate(props: TemplateProps) {
   const { device, id } = props;
   return (
      <Heading>
         Hello {device} with ID: {id}
      </Heading>
   );
}
