import { removeArrDuplicates } from "^helpers/general"
import { SanitisedRecordedEvent } from "^types/entities"

export function getRecordedEventTypeIds(
  recordedEvents: SanitisedRecordedEvent[]
) {
  const ids = recordedEvents.flatMap((recordedEvent) =>
    recordedEvent.recordedEventTypeId ? [recordedEvent.recordedEventTypeId] : []
  )
  const unique = removeArrDuplicates(ids)

  return unique
}

export function getRecordedEventsUniqueImageIds(
  recordedEvents: SanitisedRecordedEvent[]
) {
  const ids = recordedEvents.flatMap((recordedEvent) =>
    recordedEvent.summaryImage.imageId
      ? [recordedEvent.summaryImage.imageId]
      : []
  )
  const unique = removeArrDuplicates(ids)

  return unique
}
