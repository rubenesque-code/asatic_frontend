import {
  RecordedEventType,
  RecordedEventTypeTranslation,
} from "^types/entities"

export const validateTranslation = (
  translation: RecordedEventTypeTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId)
  const isName = translation.name?.length

  return Boolean(languageIsValid && isName)
}

export function validateRecordedEventTypeAsChild(
  recordedEventType: RecordedEventType | undefined | null,
  validLanguageIds: string[]
) {
  if (!recordedEventType) {
    return false
  }
  const validTranslation = recordedEventType.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}

export function filterValidRecordedEventTypesAsChildren(
  recordedEventTypes: RecordedEventType[],
  validLanguageIds: string[]
) {
  return recordedEventTypes.filter(async (recordedEventType) =>
    validateRecordedEventTypeAsChild(recordedEventType, validLanguageIds)
  )
}
