import {
   Alert,
   AlertIcon,
   Avatar,
   Box,
   Button,
   Flex,
   HStack,
   Heading,
   HeadingProps,
   Image,
   Link,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalHeader,
   ModalOverlay,
   SimpleGrid,
   Square,
   Stack,
   Text,
   VisuallyHidden,
   chakra,
   useBreakpointValue,
   useDisclosure,
   useToken,
} from '@chakra-ui/react';
import { PixelPing } from '@components/analytics/PixelPing';
import { PrerenderedHTML } from '@components/common';
import { ViewStats } from '@components/common/ViewStats';
import { IntlDate } from '@components/ui/IntlDate';
import { faCircleNodes, faList } from '@fortawesome/pro-solid-svg-icons';
import { FaIcon } from '@ifixit/icons';
import { DefaultLayout } from '@layouts/default';
import { DefaultLayoutProps } from '@layouts/default/server';
import Head from 'next/head';
import { useRef } from 'react';
import { useFlag } from '@ifixit/react-feature-flags';
import ProblemCard from './Problem';
import { HeadingSelfLink } from './components/HeadingSelfLink';
import { GoogleNoScript, TagManager } from './components/TagManager';
import type {
   Author,
   Problem,
   Section,
   TroubleshootingData,
} from './hooks/useTroubleshootingProps';
import SolutionCard from './solution';
import { TOC } from './toc';
import {
   LinkToTOC,
   TOCContextProvider,
   useTOCBufferPxScrollOnClick,
} from './tocContext';
import { uniqBy } from 'lodash';
import { NavBar } from './components/NavBar';

const RelatedProblemsRecord = {
   title: 'Related Problems',
   uniqueId: 'related-problems',
};

const Wiki: NextPageWithLayout<{
   wikiData: TroubleshootingData;
   layoutProps: DefaultLayoutProps;
}> = ({ wikiData }) => {
   const { metaDescription, title, metaKeywords, canonicalUrl, id, viewStats } =
      wikiData;

   const filteredConclusions = wikiData.conclusion.filter(
      (conclusion) => conclusion.heading !== 'Related Pages'
   );

   const hasRelatedPages = wikiData.linkedProblems.length > 0;

   const firstIntroSection = wikiData.introduction[0] || {};
   const otherIntroSections = wikiData.introduction.slice(1);
   const cleanFirstIntroSection = {
      ...firstIntroSection,
      heading: firstIntroSection.heading || 'Introduction',
      id: firstIntroSection.id || 'introduction',
   };
   const introSections = firstIntroSection.body
      ? [cleanFirstIntroSection, ...otherIntroSections]
      : wikiData.introduction;

   const sections = introSections
      .concat(wikiData.solutions)
      .concat(filteredConclusions);

   const tocItems = sections
      .map((section) => ({ title: section.heading, uniqueId: section.id }))
      .concat(hasRelatedPages ? RelatedProblemsRecord : [])
      .filter((tocItem) => tocItem.title);

   const contentContainerRef = useRef<HTMLDivElement>(null);

   const tocWidth = '220px';
   const sidebarWidth = '320px';

   const relatedProblemsFlag = useFlag('extended-related-problems');
   const RelatedProblemsComponent = relatedProblemsFlag
      ? RelatedProblemsV2
      : RelatedProblems;

   return (
      <>
         <GoogleNoScript />
         <TagManager />
         <Metadata
            metaDescription={metaDescription}
            metaKeywords={metaKeywords}
            canonicalUrl={canonicalUrl}
            title={title}
         />
         <HreflangUrls urls={wikiData.hreflangUrls} />

         <NavBar
            editUrl={wikiData.editUrl}
            historyUrl={wikiData.historyUrl}
            deviceGuideUrl={wikiData.deviceGuideUrl}
            devicePartsUrl={wikiData.devicePartsUrl}
            breadcrumbs={wikiData.breadcrumbs}
         />

         <TOCContextProvider defaultItems={tocItems}>
            <Box
               className="layout-grid"
               display="grid"
               sx={{
                  gridTemplateColumns: {
                     base: `[toc] 0 [wrapper] 1fr`,
                     lg: `[toc] ${tocWidth} [wrapper] 1fr`,
                  },
               }}
               ref={contentContainerRef}
            >
               <TOC
                  className="summary"
                  contentRef={contentContainerRef}
                  borderRight={{ lg: '1px solid' }}
                  borderColor={{ lg: 'gray.300' }}
                  maxWidth={{ base: 'calc(100% + 2 * var(--chakra-space-4))' }}
                  listItemProps={{ paddingLeft: { lg: 4 } }}
                  gridArea="toc"
               />
               <Flex
                  className="wrapper"
                  gridArea="wrapper"
                  display={{ base: 'block', sm: 'flex' }}
                  direction={{ base: 'column', xl: 'row' }}
                  fontSize="md"
                  maxW="1280px"
                  paddingTop={{ base: 0, sm: 8 }}
                  paddingX={{ base: 4, sm: 8 }}
                  paddingBottom={8}
                  minW={0}
                  marginInline={{ sm: 'auto' }}
                  flexWrap={{ base: 'wrap', xl: 'nowrap' }}
                  sx={{
                     '@media (min-width: 1340px) and (max-width: 1719px)': {
                        marginLeft: '0',
                     },
                     '@media (min-width: 1720px)': {
                        transform: `translateX(calc(${tocWidth} / -2))`,
                     },
                  }}
               >
                  <Stack
                     id="main"
                     display={{ base: 'flex', lg: 'grid' }}
                     columnGap={{ lg: 12 }}
                     spacing={4}
                     height="max-content"
                     sx={{
                        gridTemplateAreas: {
                           lg: `
                              "Content RelatedProblems"
                              "Conclusion RelatedProblems"
                              "AnswersCTA RelatedProblems"
                           `,
                        },
                        gridTemplateColumns: { lg: `1fr ${sidebarWidth}` },
                     }}
                  >
                     <Stack spacing={4} gridArea="Content">
                        <TroubleshootingHeading wikiData={wikiData} />
                        <Causes
                           introduction={introSections}
                           solutions={wikiData.solutions}
                           problems={wikiData.linkedProblems}
                        />
                        <Stack className="intro" spacing={6} pt={{ sm: 3 }}>
                           <IntroductionSections introduction={introSections} />
                        </Stack>
                        {wikiData.solutions.length > 0 && (
                           <Stack spacing={6}>
                              {wikiData.solutions.map((solution, index) => (
                                 <SolutionCard
                                    key={solution.heading}
                                    index={index + 1}
                                    solution={solution}
                                 />
                              ))}
                           </Stack>
                        )}
                     </Stack>
                     {filteredConclusions.length > 0 && (
                        <Conclusion conclusion={filteredConclusions} />
                     )}
                     <RelatedProblemsComponent
                        hasRelatedPages={hasRelatedPages}
                        wikiData={wikiData}
                     />
                     <AnswersCTA answersUrl={wikiData.answersUrl} />
                  </Stack>
               </Flex>
            </Box>
         </TOCContextProvider>
         {viewStats && <ViewStats {...viewStats} />}
         <PixelPing id={id} type="wiki" />
      </>
   );
};

function TroubleshootingHeading({
   wikiData,
}: {
   wikiData: TroubleshootingData;
}) {
   const { title, mainImageUrl, mainImageUrlLarge } = wikiData;
   const { isOpen, onOpen, onClose } = useDisclosure();
   const lastUpdatedDate = new Date(wikiData.lastUpdatedDate * 1000);
   const smBreakpoint = useToken('breakpoints', 'sm');
   const imageSx: any = {
      display: 'none',
      [`@media (min-width: ${smBreakpoint})`]: {
         display: 'block',
      },
   };

   return (
      <HStack
         spacing={0}
         align="start"
         pb="12px"
         borderBottom="1px"
         borderColor="gray.300"
      >
         <Image
            sx={imageSx}
            src={mainImageUrl}
            onClick={onOpen}
            cursor="pointer"
            alt={title}
            htmlWidth={120}
            htmlHeight={90}
            objectFit="contain"
            borderRadius="md"
            outline="1px solid"
            outlineColor="gray.300"
            marginRight={3}
         />
         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
               width="auto"
               maxWidth="calc(100% - 64px)"
               background="none"
            >
               <VisuallyHidden>
                  <ModalHeader>{title}</ModalHeader>
               </VisuallyHidden>
               <ModalCloseButton />
               <ModalBody padding={0}>
                  <Image
                     src={mainImageUrlLarge}
                     width="100%"
                     height="auto"
                     alt={title}
                  />
               </ModalBody>
            </ModalContent>
         </Modal>
         <Stack alignItems="flex-start" spacing={2}>
            <HeadingSelfLink
               as="h1"
               id="top"
               selfLinked
               fontSize={{ base: '24px', md: '30px' }}
            >
               {wikiData.title}
            </HeadingSelfLink>
            <AuthorInformation
               lastUpdatedDate={lastUpdatedDate}
               authors={wikiData.authors}
               historyUrl={wikiData.historyUrl}
            />
         </Stack>
      </HStack>
   );
}

function Causes({
   introduction,
   solutions,
   problems,
}: {
   introduction: Section[];
   solutions: Section[];
   problems: Problem[];
}) {
   const lgBreakpoint = useToken('breakpoints', 'lg');

   const sx = {
      display: 'block',
      [`@media (min-width: ${lgBreakpoint})`]: {
         display: 'none',
      },
   };

   return (
      <Box
         mb={{ base: 4, md: 7 }}
         pb={4}
         borderBottom="1px"
         borderColor="gray.300"
         sx={sx}
      >
         <HeadingSelfLink as="h2" fontWeight="semibold" selfLinked id="causes">
            {'Causes'}
         </HeadingSelfLink>
         <Stack
            as="nav"
            align="flex-start"
            color="brand.500"
            mt={4}
            spacing={2}
         >
            {introduction.map((intro) => (
               <CausesIntro key={intro.heading} {...intro} />
            ))}
            {solutions.map((solution, index) => (
               <CausesSolution
                  key={solution.heading}
                  {...solution}
                  index={index}
               />
            ))}
            {problems.length > 0 && <CausesRelatedProblem />}
         </Stack>
      </Box>
   );
}

function CausesIntro({ heading, id }: Section) {
   const { onClick } = useTOCBufferPxScrollOnClick(id);

   return (
      <Stack>
         <Link
            href={`#${id}`}
            fontWeight="semibold"
            display="flex"
            onClick={onClick}
         >
            <Square
               size={6}
               border="1px solid"
               borderColor="brand.700"
               borderRadius="md"
               mr={2}
            >
               <FaIcon icon={faList} color="brand.500" />
            </Square>
            <Box as="span">{heading}</Box>
         </Link>
      </Stack>
   );
}

function CausesSolution({ heading, id, index }: Section & { index: number }) {
   const { onClick } = useTOCBufferPxScrollOnClick(id);

   return (
      <Stack>
         <Link
            href={`#${id}`}
            fontWeight="semibold"
            display="flex"
            onClick={onClick}
         >
            <Square
               size={6}
               bgColor="brand.500"
               border="1px solid"
               borderColor="brand.700"
               borderRadius="md"
               color="white"
               mr={2}
               fontSize="sm"
            >
               {index + 1}
            </Square>
            <Box as="span">{heading}</Box>
         </Link>
      </Stack>
   );
}

function CausesRelatedProblem() {
   const { onClick } = useTOCBufferPxScrollOnClick(
      RelatedProblemsRecord.uniqueId
   );

   return (
      <Stack>
         <Link
            href={`#${RelatedProblemsRecord.uniqueId}`}
            fontWeight="semibold"
            display="flex"
            onClick={onClick}
         >
            <Square
               size={6}
               border="1px solid"
               borderColor="brand.700"
               borderRadius="md"
               mr={2}
            >
               <FaIcon icon={faCircleNodes} color="brand.500" />
            </Square>
            <Box as="span">Related Problems</Box>
         </Link>
      </Stack>
   );
}

function HreflangUrls({ urls }: { urls: Record<string, string> }) {
   const hreflangs = Object.entries(urls);
   return (
      <Head>
         {hreflangs.map(([lang, url]) => (
            <link
               rel="alternate"
               key={`hreflang-${lang}`}
               hrefLang={lang}
               href={url}
            />
         ))}
      </Head>
   );
}

function Metadata({
   metaDescription,
   title,
   metaKeywords,
   canonicalUrl,
}: {
   metaDescription: string;
   title: string;
   metaKeywords: string;
   canonicalUrl: string;
}) {
   return (
      <Head>
         <meta
            key="meta-description"
            name="description"
            content={metaDescription}
         />
         <meta key="meta-title" name="title" content={title} />
         <meta key="meta-keywords" name="keywords" content={metaKeywords} />
         <meta key="meta-robots" name="robots" content="index, follow" />,
         <link key="canonical" rel="canonical" href={canonicalUrl} />
      </Head>
   );
}

function AuthorInformation({
   lastUpdatedDate,
   authors,
   historyUrl,
}: {
   lastUpdatedDate: Date;
   authors: Author[];
   historyUrl: string;
}) {
   const primaryAuthor: Author | undefined = authors[0];
   const otherAuthors = authors.slice(1);
   return (
      <Flex align="center" gap={1.5}>
         {primaryAuthor && <AuthorAvatar author={primaryAuthor} />}
         <Flex justify="center" direction="column">
            {primaryAuthor && (
               <AuthorListing
                  primaryAuthor={primaryAuthor}
                  authorCount={otherAuthors.length}
                  authorProfileUrl={primaryAuthor.profileUrl}
                  historyUrl={historyUrl}
               />
            )}
            <LastUpdatedDate
               lastUpdatedDate={lastUpdatedDate}
               historyUrl={historyUrl}
            />
         </Flex>
      </Flex>
   );
}

function AuthorAvatar({ author }: { author: Author }) {
   return (
      <Avatar
         size="md"
         boxSize={10}
         showBorder={true}
         borderColor="brand.500"
         name={author.username}
         src={author.avatar}
      />
   );
}

function LastUpdatedDate({
   lastUpdatedDate,
   historyUrl,
}: {
   lastUpdatedDate: Date;
   historyUrl: string;
}) {
   return (
      <Link
         href={historyUrl}
         fontWeight="normal"
         fontSize="sm"
         color="gray.500"
      >
         Last updated on{' '}
         <IntlDate
            value={lastUpdatedDate}
            options={{
               year: 'numeric',
               month: 'long',
               day: 'numeric',
            }}
         />
      </Link>
   );
}

function AuthorListing({
   primaryAuthor,
   authorCount,
   historyUrl,
   authorProfileUrl,
}: {
   primaryAuthor: Author;
   authorCount: number;
   historyUrl: string;
   authorProfileUrl: string;
}) {
   const primaryAuthorName = primaryAuthor.username;
   const contributorDescription =
      authorCount > 1 ? 'contributors' : 'contributor';
   const linkStyle = {
      fontWeight: 'medium',
      color: 'brand.500',
   };
   return (
      <Box fontSize="sm">
         <Link href={authorProfileUrl} {...linkStyle}>
            {primaryAuthorName}
         </Link>
         {authorCount > 0 && (
            <>
               <chakra.span as="span" color="gray.900">
                  {' and '}
               </chakra.span>
               <Link {...linkStyle} href={historyUrl}>
                  {`${authorCount} ${contributorDescription}`}
               </Link>
            </>
         )}
      </Box>
   );
}

function IntroductionSections({ introduction }: { introduction: Section[] }) {
   if (!introduction.length) {
      return null;
   }

   return (
      <Stack spacing={6}>
         {introduction.map((intro) => (
            <IntroductionSection key={intro.heading} intro={intro} mt={0} />
         ))}
      </Stack>
   );
}

function IntroductionSection({
   intro,
   ...headingProps
}: { intro: Section } & HeadingProps) {
   const bufferPx = useBreakpointValue({ base: -46, lg: -6 });
   const { ref } = LinkToTOC<HTMLHeadingElement>(intro.id, bufferPx);
   const { onClick } = useTOCBufferPxScrollOnClick(intro.id);

   return (
      <Stack spacing={3} ref={ref} id={intro.id}>
         {intro.heading && (
            <HeadingSelfLink
               fontWeight="semibold"
               aria-label={intro.heading}
               selfLinked
               id={intro.id}
               onClick={onClick}
               {...headingProps}
            >
               {intro.heading}
            </HeadingSelfLink>
         )}
         <PrerenderedHTML html={intro.body} template="troubleshooting" />
      </Stack>
   );
}

const ConclusionSection = function ConclusionSectionInner({
   conclusion,
}: {
   conclusion: Section;
}) {
   const bufferPx = useBreakpointValue({ base: -40, lg: 0 });
   const { ref } = LinkToTOC<HTMLHeadingElement>(conclusion.id, bufferPx);
   const { onClick } = useTOCBufferPxScrollOnClick(conclusion.id);

   return (
      <Box id={conclusion.id} ref={ref}>
         <HeadingSelfLink id={conclusion.id} onClick={onClick}>
            {conclusion.heading}
         </HeadingSelfLink>
         <PrerenderedHTML html={conclusion.body} template="troubleshooting" />
      </Box>
   );
};

function Conclusion({ conclusion: conclusions }: { conclusion: Section[] }) {
   return (
      <Box pt={{ base: 0, sm: 6 }} gridArea="Conclusion">
         {conclusions.map((conclusion) => (
            <ConclusionSection
               key={conclusion.heading}
               conclusion={conclusion}
            />
         ))}
      </Box>
   );
}

function AnswersCTA({ answersUrl }: { answersUrl: string }) {
   return (
      <Alert p={3} fontSize="sm" gridArea="AnswersCTA">
         <AlertIcon
            color="gray.500"
            alignSelf={{ base: 'start', sm: 'center' }}
         />
         <HStack
            align="center"
            flex="auto"
            justify="space-between"
            sx={{
               '@media (max-width: 375px)': {
                  flexDirection: 'column',
                  spacing: '1.5',
                  alignItems: 'end',
               },
            }}
         >
            <chakra.span>
               Haven&apos;t found the solution to your problem?
            </chakra.span>
            <Button href={answersUrl} as="a" colorScheme="brand" ml={3}>
               Browse our forum
            </Button>
         </HStack>
      </Alert>
   );
}

function RelatedProblems({
   wikiData,
   hasRelatedPages,
}: {
   wikiData: TroubleshootingData;
   hasRelatedPages?: boolean;
}) {
   const { linkedProblems, deviceGuideUrl, countOfAssociatedProblems } =
      wikiData;
   const { displayTitle, imageUrl, description } = wikiData.category;

   const bufferPx = useBreakpointValue({ base: -40, lg: 0 });
   const { ref } = LinkToTOC<HTMLHeadingElement>(
      RelatedProblemsRecord.uniqueId,
      bufferPx
   );

   return (
      <Stack
         id={RelatedProblemsRecord.uniqueId}
         ref={ref}
         className="sidebar"
         spacing={{ base: 4, xl: 6 }}
         width={{ base: '100%' }}
         alignSelf="start"
         fontSize="14px"
         pt={{ base: 6, xl: 0 }}
         gridArea="RelatedProblems"
      >
         {hasRelatedPages && <LinkedProblems problems={linkedProblems} />}
         <DeviceCard
            imageUrl={imageUrl}
            displayTitle={displayTitle}
            description={description}
            countOfAssociatedProblems={countOfAssociatedProblems}
            deviceGuideUrl={deviceGuideUrl}
         />
      </Stack>
   );
}

function RelatedProblemsV2({
   wikiData,
   hasRelatedPages,
}: {
   wikiData: TroubleshootingData;
   hasRelatedPages?: boolean;
}) {
   const {
      linkedProblems,
      relatedProblems,
      deviceGuideUrl,
      countOfAssociatedProblems,
   } = wikiData;
   const { displayTitle, imageUrl, description } = wikiData.category;

   const bufferPx = useBreakpointValue({ base: -40, lg: 0 });
   const { ref } = LinkToTOC<HTMLHeadingElement>(
      RelatedProblemsRecord.uniqueId,
      bufferPx
   );
   const problems = linkedProblems.concat(relatedProblems);
   // We don't want to omit any linked problems, but we also don't want to add
   // an unlimited number of additional problems from the device.
   const maxProblems = Math.max(6, linkedProblems.length);
   const uniqProblems = uniqBy(problems, 'title').slice(0, maxProblems);

   return (
      <Stack
         id={RelatedProblemsRecord.uniqueId}
         ref={ref}
         data-test="related-problems-v2"
         className="sidebar"
         spacing={{ base: 4, xl: 6 }}
         width={{ base: '100%' }}
         alignSelf="start"
         fontSize="14px"
         pt={{ base: 0, sm: 6 }}
         gridArea="RelatedProblems"
      >
         {hasRelatedPages && <LinkedProblems problems={uniqProblems} />}
         <DeviceCard
            imageUrl={imageUrl}
            displayTitle={displayTitle}
            description={description}
            countOfAssociatedProblems={countOfAssociatedProblems}
            deviceGuideUrl={deviceGuideUrl}
         />
      </Stack>
   );
}

function DeviceCard({
   imageUrl,
   displayTitle,
   description,
   countOfAssociatedProblems,
   deviceGuideUrl,
}: {
   imageUrl: string;
   displayTitle: string;
   description: string;
   countOfAssociatedProblems: number;
   deviceGuideUrl: string | undefined;
}) {
   return (
      <Stack
         className="question"
         spacing={1.5}
         display="flex"
         order={{ xl: -1 }}
      >
         <Box
            bgColor="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            overflow="hidden"
         >
            <Flex gap={2} padding={3} align="center">
               <Image
                  src={imageUrl}
                  alt={displayTitle}
                  minWidth={{ base: '75px', md: '104px' }}
                  minHeight={{ base: '56px', md: '78px' }}
                  htmlWidth={104}
                  htmlHeight={78}
                  objectFit="cover"
                  borderRadius="md"
                  outline="1px solid"
                  outlineColor="gray.300"
                  overflow="hidden"
                  aspectRatio="4 / 3"
               />
               <Box display="block" lineHeight="normal">
                  <Box fontWeight="semibold" my="auto">
                     {displayTitle}
                  </Box>
                  <Box display={{ base: 'none', sm: '-webkit-box' }} mt={1}>
                     <PrerenderedHTML
                        noOfLines={4}
                        template="troubleshooting"
                        html={description}
                     />
                  </Box>
               </Box>
            </Flex>
            {countOfAssociatedProblems && (
               <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  w="100%"
                  padding={3}
                  bg="gray.100"
                  borderTop="1px solid"
                  borderColor="gray.300"
               >
                  <Text>
                     {countOfAssociatedProblems === 1
                        ? '1 common problem'
                        : countOfAssociatedProblems + ' common problems'}
                  </Text>
                  <Link href={deviceGuideUrl} textColor="brand.500">
                     {countOfAssociatedProblems === 1
                        ? 'View problem'
                        : 'View all'}
                  </Link>
               </Flex>
            )}
         </Box>
      </Stack>
   );
}

function LinkedProblems({ problems }: { problems: Problem[] }) {
   return (
      <Stack spacing={3}>
         <Heading
            as="h3"
            fontSize={{ base: '20px', md: '24px' }}
            fontWeight="medium"
            lineHeight="normal"
         >
            {RelatedProblemsRecord.title}
         </Heading>
         <SimpleGrid
            className="list"
            columns={{ base: 1, sm: 2, lg: 1 }}
            spacing={3}
         >
            {problems.map((problem) => (
               <ProblemCard problem={problem} key={problem.title} />
            ))}
         </SimpleGrid>
      </Stack>
   );
}

Wiki.getLayout = function getLayout(page, pageProps) {
   return <DefaultLayout {...pageProps.layoutProps}>{page}</DefaultLayout>;
};

export default Wiki;
