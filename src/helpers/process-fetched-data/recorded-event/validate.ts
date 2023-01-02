import {
  RecordedEventTranslation,
  SanitisedRecordedEvent,
} from "^types/entities"

/** Requires: valid languageId, title with length. */
export function validateTranslation(
  translation: RecordedEventTranslation,
  languageIds: string[]
) {
  if (!languageIds.includes(translation.languageId)) {
    return false
  }
  if (!translation.title?.length) {
    return false
  }

  return true
}

export function validateRecordedEvent<TEntity extends SanitisedRecordedEvent>(
  entity: TEntity,
  validLanguageIds: string[]
): boolean {
  const isVideo = entity.youtubeId

  if (!isVideo) {
    return false
  }

  const validTranslation = entity.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}
export function filterValidRecordedEvents(
  recordedEvents: SanitisedRecordedEvent[],
  validLanguageIds: string[]
) {
  return recordedEvents.filter((recordedEvent) =>
    validateRecordedEvent(recordedEvent, validLanguageIds)
  )
}
