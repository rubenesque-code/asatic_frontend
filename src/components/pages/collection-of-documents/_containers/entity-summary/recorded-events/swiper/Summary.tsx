/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { determineChildTranslation } from "^helpers/document"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"

import { Authors_, DateString_ } from "^components/pages/_containers"
import { SummaryImage_, Type_ } from "../_containers"

import { $SwiperSlideContainer } from "^entity-summary/_presentation/$SwiperSlide"
import {
  $authors,
  $Date,
  $Title,
} from "^entity-summary/_styles/$swiper-summary"
import { EntityLink_ } from "^entity-summary/_containers"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const RecordedEventSwiperSummary = ({
  recordedEvent,
  parentCurrentLanguageId,
  index,
}: {
  recordedEvent: RecordedEventAsSummary
  parentCurrentLanguageId: string
  index: number
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const translation = determineChildTranslation(
    recordedEvent.translations,
    parentCurrentLanguageId
  )

  return (
    <$SwiperSlideContainer index={index}>
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
      <Authors_
        authors={recordedEvent.authors}
        parentLanguageId={translation.languageId}
        styles={$authors}
      />
      <$Date languageId={siteLanguage.id}>
        <DateString_
          engDateStr={recordedEvent.publishDate}
          languageId={translation.languageId}
        />
      </$Date>
    </$SwiperSlideContainer>
  )
}

export default RecordedEventSwiperSummary
