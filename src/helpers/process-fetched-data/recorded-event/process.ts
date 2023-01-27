import { sanitize } from "dompurify"
import produce from "immer"

import { filterAndMapEntitiesById, findEntityById, mapIds } from "^helpers/data"
import {
  Image,
  RecordedEventType,
  SanitisedRecordedEvent,
} from "^types/entities"
import { MakeRequired } from "^types/utilities"
import { processAuthorsAsChildren } from "../author/process"
import { validateTranslation } from "./validate"
import { processRecordedEventTypesAsChildren } from "../recorded-event-type/process"

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

export function processRecordedEventAsSummary(
  recordedEvent: SanitisedRecordedEvent,
  {
    validLanguageIds,
    validImages,
    processedAuthors,
    processedRecordedEventTypes,
  }: {
    validLanguageIds: string[]
    validImages: Image[]
    processedAuthors: ReturnType<typeof processAuthorsAsChildren>
    processedRecordedEventTypes: ReturnType<
      typeof processRecordedEventTypesAsChildren
    >
  }
) {
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

  const processedTranslations = recordedEvent.translations
    .filter((translation) => validateTranslation(translation, validLanguageIds))
    .map((translation) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title: sanitize(translation.title!),
        languageId: translation.languageId,
      }
    })

  const recordedEventType =
    recordedEvent.recordedEventTypeId &&
    mapIds(processedRecordedEventTypes).includes(
      recordedEvent.recordedEventTypeId
    )
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        processedRecordedEventTypes.find(
          (recordedEventType) =>
            recordedEventType.id === recordedEvent.recordedEventTypeId
        )!
      : null

  const processed = {
    id: recordedEvent.id,
    publishDate: recordedEvent.publishDate,
    type: recordedEvent.type,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    youtubeId: recordedEvent.youtubeId!,
    summaryImage: summaryImage
      ? {
          vertPosition: recordedEvent.summaryImage.vertPosition,
          storageImage: summaryImage,
        }
      : null,
    translations: processedTranslations,
    authors: filterAndMapEntitiesById(
      recordedEvent.authorsIds,
      processedAuthors
    ),
    recordedEventType,
  }

  return processed
}

export type RecordedEventAsSummary = ReturnType<
  typeof processRecordedEventAsSummary
>

export function processRecordedEventsAsSummarries(
  recordedEvents: SanitisedRecordedEvent[],
  {
    validLanguageIds,
    validImages,
    processedAuthors,
    processedRecordedEventTypes,
  }: {
    validLanguageIds: string[]
    validImages: Image[]
    processedAuthors: ReturnType<typeof processAuthorsAsChildren>
    processedRecordedEventTypes: ReturnType<
      typeof processRecordedEventTypesAsChildren
    >
  }
) {
  return recordedEvents.map((recordedEvent) =>
    processRecordedEventAsSummary(recordedEvent, {
      processedAuthors,
      processedRecordedEventTypes,
      validImages,
      validLanguageIds,
    })
  )
}
