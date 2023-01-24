import { sortEntitiesByDate } from "^helpers/manipulateEntity"

import { Swiper_ } from "^page-container"
import Summary from "./Summary"
import { $SwiperSectionLayout } from "../../_presentation/$SwiperSectionLayout"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { siteTranslations } from "^constants/siteTranslations"
import { SiteLanguageId } from "^constants/languages"

const RecordedEventSwiperSection = ({
  recordedEvents,
  parentCurrentLanguageId,
  showSeeAllElement = false,
}: {
  recordedEvents: RecordedEventAsSummary[] | null
  parentCurrentLanguageId: string
  showSeeAllElement?: boolean
}) => {
  if (!recordedEvents?.length) {
    return null
  }

  const orderedRecordedEvents = sortEntitiesByDate(recordedEvents)

  const languageId: SiteLanguageId =
    parentCurrentLanguageId === "tamil" ? "tamil" : "english"

  return (
    <$SwiperSectionLayout
      swiper={
        <Swiper_
          slides={({ numSlidesPerView }) =>
            orderedRecordedEvents.map((recordedEvent, i) => (
              <Summary
                recordedEvent={recordedEvent}
                parentCurrentLanguageId={parentCurrentLanguageId}
                index={i}
                rightBorder={
                  orderedRecordedEvents.length < numSlidesPerView &&
                  i === orderedRecordedEvents.length - 1
                }
                key={recordedEvent.id}
              />
            ))
          }
        />
      }
      title={siteTranslations.recordedEvents[languageId]}
      seeAllText={
        showSeeAllElement
          ? `${siteTranslations.more[languageId]} ${siteTranslations.recordedEvents[languageId]}`
          : undefined
      }
      routeKey="recordedEvents"
      parentCurrentLanguageId={parentCurrentLanguageId}
    />
  )
}

export default RecordedEventSwiperSection
