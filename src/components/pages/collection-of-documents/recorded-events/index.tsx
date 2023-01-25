import tw from "twin.macro"

import { StaticData } from "./staticData"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { findTranslationByLanguageId } from "^helpers/data"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { Summary_ } from "^entity-summary/recorded-events/_containers"

const RecordedEventsPageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <PageBody pageData={pageData} />
    </PageLayout_>
  )
}

export default RecordedEventsPageContent

const PageBody = ({
  pageData: { languages, recordedEvents },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  const recordedEventsProcessed = sortEntitiesByDate(
    recordedEvents.filter((recordedEvent) =>
      findTranslationByLanguageId(recordedEvent.translations, filterLanguage.id)
    )
  )

  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
          <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
            {siteTranslations.recordedEvents[siteLanguage.id]}
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
          {recordedEventsProcessed.map((recordedEvent, i) => {
            return (
              <$SummaryContainer
                css={[
                  i % 2 === 0 ? tw`sm:border-r` : tw`border-r-0`,
                  i < recordedEventsProcessed.length
                    ? tw`border-b`
                    : tw`border-b-0`,
                  recordedEventsProcessed.length % 2 === 0
                    ? i < recordedEventsProcessed.length - 2
                      ? tw`sm:border-b`
                      : tw`sm:border-b-0`
                    : recordedEventsProcessed.length % 2 === 1 &&
                      i < recordedEventsProcessed.length - 1
                    ? tw`sm:border-b`
                    : tw`sm:border-b-0`,
                ]}
                key={recordedEvent.id}
              >
                <Summary_
                  parentCurrentLanguageId={filterLanguage.id}
                  recordedEvent={recordedEvent}
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
