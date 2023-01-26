import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageWrapper_ } from "^components/pages/_containers"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import CollectionSummary from "^entity-summary/collections/Summary"

const CollectionsPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.collections[siteLanguage.id]}
    >
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default CollectionsPageContent

const PageBody = ({
  pageData: { collections, languages },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  const collectionsProcessed = sortEntitiesByDate(
    collections.filter(
      (collection) => collection.languageId === filterLanguage.id
    )
  )

  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
          <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
            {siteTranslations.collections[siteLanguage.id]}
          </h1>
          <div css={[tw`pt-sm`]}>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={languages}
            />
          </div>
        </$SectionContent>
      </div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`grid grid-cols-1 sm:grid-cols-2`]}>
          {collectionsProcessed.map((collection, i) => {
            return (
              <$SummaryContainer
                css={[
                  i % 2 === 0 ? tw`sm:border-r` : tw`border-r-0`,
                  i < collectionsProcessed.length
                    ? tw`border-b`
                    : tw`border-b-0`,
                  collectionsProcessed.length % 2 === 0
                    ? i < collectionsProcessed.length - 2
                      ? tw`sm:border-b`
                      : tw`sm:border-b-0`
                    : collectionsProcessed.length % 2 === 1 &&
                      i < collectionsProcessed.length - 1
                    ? tw`sm:border-b`
                    : tw`sm:border-b-0`,
                  collection.languageId === "tamil"
                    ? tw`font-serif-primary-tamil`
                    : tw`font-serif-primary`,
                ]}
                key={collection.id}
              >
                <CollectionSummary
                  collection={collection}
                  maxCharacters={300}
                />
              </$SummaryContainer>
            )
          })}
        </$SectionContent>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`
