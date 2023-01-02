import produce from "immer"

import { findEntityById, mapIds } from "^helpers/data"
import {
  Image,
  RecordedEventType,
  SanitisedRecordedEvent,
} from "^types/entities"
import { MakeRequired } from "^types/utilities"
import { validateTranslation } from "./validate"

type ProcessedTranslation = MakeRequired<
  SanitisedRecordedEvent["translations"][number],
  "title"
>

export function processRecordedEventForOwnPage({
  recordedEvent,
  validLanguageIds,
  recordedEventType,
}: {
  recordedEvent: SanitisedRecordedEvent
  validLanguageIds: string[]
  recordedEventType: RecordedEventType | null | undefined
}) {
  // remove invalid translations; remove empty translation sections.
  const processedTranslations = produce(recordedEvent.translations, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const translation = draft[i]

      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        // const translationIndex = draft.findIndex((t) => t.id === translation.id)
        draft.splice(i, 1)
        break
      }
    }
  }) as ProcessedTranslation[]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { recordedEventTypeId, ...restRecordedEvent } = recordedEvent

  const processed = {
    id: recordedEvent.id,
    publishDate: recordedEvent.publishDate,
    translations: processedTranslations,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    youtubeId: recordedEvent.youtubeId!,
    ...(recordedEventType && { recordedEventType }),
  }

  return processed
}

type AsSummaryValidTranslation = MakeRequired<
  SanitisedRecordedEvent["translations"][number],
  "title"
>

export function processRecordedEventAsSummary({
  recordedEvent,
  validLanguageIds,
  validImages,
  validAuthorIds,
  validRecordedEventTypes,
}: {
  recordedEvent: SanitisedRecordedEvent
  validLanguageIds: string[]
  validImages: Image[]
  validAuthorIds: string[]
  validRecordedEventTypes: RecordedEventType[]
}) {
  let summaryImage: Image | null = null

  if (recordedEvent.summaryImage.imageId) {
    const storageImage = findEntityById(
      validImages,
      recordedEvent.summaryImage.imageId
    )
    if (storageImage) {
      summaryImage = storageImage
    }
  }

  const validTranslations = recordedEvent.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as AsSummaryValidTranslation[]

  const processedTranslations = validTranslations.map((translation) => {
    return {
      title: translation.title,
      languageId: translation.languageId,
    }
  })

  const recordedEventType =
    recordedEvent.recordedEventTypeId &&
    mapIds(validRecordedEventTypes).includes(recordedEvent.recordedEventTypeId)
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        validRecordedEventTypes.find(
          (recordedEventType) =>
            recordedEventType.id === recordedEvent.recordedEventTypeId
        )!
      : null

  const processed = {
    id: recordedEvent.id,
    publishDate: recordedEvent.publishDate,
    type: recordedEvent.type,
    summaryImage: summaryImage
      ? {
          vertPosition: recordedEvent.summaryImage.vertPosition,
          storageImage: summaryImage,
        }
      : null,
    translations: processedTranslations,
    authors: recordedEvent.authorsIds.filter((authorId) =>
      validAuthorIds.includes(authorId)
    ),
    recordedEventType,
  }

  return processed
}
