import { SanitisedRecordedEvent } from "^types/entities"

export function getRecordedEventTypeIds(
  recordedEvents: SanitisedRecordedEvent[]
) {
  const uniqueIds = recordedEvents.flatMap((recordedEvent) =>
    recordedEvent.recordedEventTypeId ? [recordedEvent.recordedEventTypeId] : []
  )

  return uniqueIds
}
