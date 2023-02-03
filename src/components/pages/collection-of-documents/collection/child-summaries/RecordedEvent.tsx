/* eslint-disable @next/next/no-img-element */
import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"

import { Authors_, DateString_ } from "^components/pages/_containers"
import { EntityLink_ } from "^entity-summary/_containers"
import {
  SummaryImage_,
  Type_,
} from "^entity-summary/recorded-events/_containers"
import { $Title, $authors, $Date } from "^entity-summary/_styles/$summary"
import { $ImageContainer } from "../_styles"
import { useGlobalDataContext } from "^context/GlobalData"

const RecordedEvent = ({
  recordedEvent,
  parentCurrentLanguageId,
}: {
  recordedEvent: RecordedEventAsSummary
  parentCurrentLanguageId: string
}) => {
  const globalData = useGlobalDataContext()

  const translation = determineChildTranslation(
    recordedEvent.translations,
    parentCurrentLanguageId
  )

  return (
    <div css={[tw`w-full sm:flex sm:gap-sm`]}>
      <$ImageContainer>
        <SummaryImage_
          image={recordedEvent.summaryImage}
          youtubeId={recordedEvent.youtubeId}
        />
      </$ImageContainer>
      <div>
        <Type_
          type={recordedEvent.recordedEventType}
          parentLanguageId={translation.languageId}
        />
        <EntityLink_
          documentLanguageId={translation.languageId}
          entityId={recordedEvent.id}
          routeKey="recordedEvents"
        >
          <$Title>{translation.title}</$Title>
        </EntityLink_>
        {globalData.isMultipleAuthors ? (
          <Authors_
            authors={recordedEvent.authors}
            parentLanguageId={translation.languageId}
            styles={$authors}
          />
        ) : null}
        <$Date languageId={parentCurrentLanguageId}>
          <DateString_
            engDateStr={recordedEvent.publishDate}
            languageId={translation.languageId}
          />
        </$Date>
      </div>
    </div>
  )
}

export default RecordedEvent
