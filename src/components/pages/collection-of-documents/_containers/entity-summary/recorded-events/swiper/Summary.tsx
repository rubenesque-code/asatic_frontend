import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"

import { $SwiperSlideContainer } from "^entity-summary/_presentation/$SwiperSlide"
import { Summary_ } from "../_containers"

const RecordedEventSwiperSummary = ({
  recordedEvent,
  parentCurrentLanguageId,
  index,
  rightBorder,
}: {
  recordedEvent: RecordedEventAsSummary
  parentCurrentLanguageId: string
  index: number
  rightBorder: boolean
}) => {
  return (
    <$SwiperSlideContainer index={index} rightBorder={rightBorder}>
      <Summary_
        parentCurrentLanguageId={parentCurrentLanguageId}
        recordedEvent={recordedEvent}
      />
    </$SwiperSlideContainer>
  )
}

export default RecordedEventSwiperSummary
