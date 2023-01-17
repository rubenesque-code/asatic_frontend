import { sortEntitiesByDate } from "^helpers/manipulateEntity"

import { Swiper_ } from "^page-container"
import Summary from "./Summary"
import { $SwiperSectionLayout } from "../../_presentation/$SwiperSectionLayout"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"

const RecordedEventSwiperSection = ({
  recordedEvents,
  parentCurrentLanguageId,
}: {
  recordedEvents: RecordedEventAsSummary[]
  parentCurrentLanguageId: string
}) => {
  if (!recordedEvents.length) {
    return null
  }

  const orderedRecordedEvents = sortEntitiesByDate(recordedEvents)

  return (
    <$SwiperSectionLayout
      swiper={
        <Swiper_
          slides={orderedRecordedEvents.map((recordedEvent, i) => (
            <Summary
              recordedEvent={recordedEvent}
              parentCurrentLanguageId={parentCurrentLanguageId}
              index={i}
              key={recordedEvent.id}
            />
          ))}
        />
      }
      title="Videos"
    />
  )
}

export default RecordedEventSwiperSection
