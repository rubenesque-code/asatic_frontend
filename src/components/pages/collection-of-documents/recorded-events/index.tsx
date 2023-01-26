import tw from "twin.macro"

import { StaticData } from "./staticData"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { findTranslationByLanguageId } from "^helpers/data"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"

import { PageWrapper_ } from "^components/pages/_containers"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { Summary_ } from "^entity-summary/recorded-events/_containers"
import { $ContentSectionLayout_ } from "^components/pages/_presentation"
import { BodyHeaderLayout_ } from "^components/pages/_containers/BodyHeaderLayout_"

const RecordedEventsPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.recordedEvents[siteLanguage.id]}
    >
      <PageBody pageData={pageData} />
    </PageWrapper_>
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
    <div
      css={[
        filterLanguage.id === "tamil"
          ? tw`font-serif-primary-tamil`
          : tw`font-serif-primary`,
      ]}
    >
      <BodyHeaderLayout_
        title={siteTranslations.recordedEvents[siteLanguage.id]}
        languages={{
          documentLanguage: filterLanguage,
          documentLanguages: languages,
        }}
      />
      <div css={[tw`border-b`]}>
        <$ContentSectionLayout_>
          <div css={[tw`border-l border-r grid grid-cols-1 sm:grid-cols-2`]}>
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
          </div>
        </$ContentSectionLayout_>
      </div>
    </div>
  )
}
