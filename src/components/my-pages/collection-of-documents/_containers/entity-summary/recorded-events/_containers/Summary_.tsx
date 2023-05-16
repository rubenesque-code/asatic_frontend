import { determineChildTranslation } from "^helpers/document"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"

import { Authors_, DateString_ } from "^components/my-pages/_containers"
import { SummaryImage_, Type_ } from "../_containers"

import {
  $authors,
  $Date,
  $Title,
} from "^entity-summary/_styles/$swiper-summary"
import { EntityLink_ } from "^entity-summary/_containers"
import tw from "twin.macro"
import { useGlobalDataContext } from "^context/GlobalData"

export type Summary_Props = {
  recordedEvent: RecordedEventAsSummary
  parentCurrentLanguageId: string
}

export const Summary_ = ({
  recordedEvent,
  parentCurrentLanguageId,
}: Summary_Props) => {
  const globalData = useGlobalDataContext()

  const translation = determineChildTranslation(
    recordedEvent.translations,
    parentCurrentLanguageId
  )
  return (
    <div
      css={[
        parentCurrentLanguageId === "tamil"
          ? tw`font-serif-primary-tamil`
          : tw`font-serif-primary`,
      ]}
    >
      <SummaryImage_
        image={recordedEvent.summaryImage}
        youtubeId={recordedEvent.youtubeId}
      />
      <Type_
        type={recordedEvent.recordedEventType}
        parentLanguageId={translation.languageId}
      />
      <EntityLink_
        entityId={recordedEvent.id}
        documentLanguageId={translation.languageId}
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
  )
}
