import { DefaultLayout } from '@layouts/default';
import {
   FeatureProvider,
   Features,
   WithFeature,
   getAllFeatures,
   useFeatureContext,
} from '@components/common/Feature';
import {
   Container,
   FormControl,
   FormLabel,
   SimpleGrid,
   Switch,
   Text,
} from '@chakra-ui/react';
import { FeaturesSSRProps } from '@pages/dev/features';
import Head from 'next/head';
import { RestrictRobots } from '@helpers/next-helpers';

const FeatureTemplate: NextPageWithLayout<FeaturesSSRProps> = ({ cookies }) => {
   const features = getAllFeatures();
   return (
      <FeatureProvider cookies={cookies}>
         <Container maxW="container.lg">
            <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
               {features.map((feature) => (
                  <FeatureSwitch key={feature} feature={feature} />
               ))}
            </FormControl>

            <WithFeature enabled={Features.ShowFeatureToasts}>
               <Text>
                  Component enabled via{' '}
                  <code>WithFeature enabled={Features.ShowFeatureToasts}</code>
               </Text>
            </WithFeature>
            <WithFeature disabled={Features.ShowFeatureToasts}>
               <Text>
                  Component enabled via{' '}
                  <code>WithFeature disabled={Features.ShowFeatureToasts}</code>
               </Text>
            </WithFeature>
         </Container>
      </FeatureProvider>
   );
};

function FeatureSwitch({ feature }: { feature: Features }) {
   const { isEnabled, toggleFeature } = useFeatureContext();
   return (
      <>
         <FormLabel htmlFor={feature}>{feature}:</FormLabel>
         <Switch
            isChecked={isEnabled(feature)}
            onChange={() => toggleFeature(feature)}
         />
      </>
   );
}

FeatureTemplate.getLayout = function getLayout(page, pageProps) {
   return (
      <>
         <Head>
            <meta
               name="robots"
               content={RestrictRobots.RESTRICT_ALL.toString()}
            />
         </Head>
         <DefaultLayout {...pageProps.layoutProps}>{page}</DefaultLayout>
      </>
   );
};

export default FeatureTemplate;
