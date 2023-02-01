import DOMPurify from "isomorphic-dompurify"

import { filterAndMapEntitiesById, findEntityById, mapIds } from "^helpers/data"
import { Image, SanitisedRecordedEvent } from "^types/entities"
import { processAuthorsAsChildren } from "../author/process"
import { validateTranslation } from "./validate"
import { processRecordedEventTypesAsChildren } from "../recorded-event-type/process"

export function processRecordedEventForOwnPage(
  recordedEvent: SanitisedRecordedEvent,
  {
    validLanguageIds,
    processedRecordedEventType,
  }: {
    validLanguageIds: string[]
    processedRecordedEventType:
      | ReturnType<typeof processRecordedEventTypesAsChildren>[number]
      | null
      | undefined
  }
) {
  const translationsProcessed = recordedEvent.translations
    .filter((translation) => validateTranslation(translation, validLanguageIds))
    .map((translation) => ({
      id: translation.id,
      languageId: translation.languageId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      title: DOMPurify.sanitize(translation.title!),
      ...(translation.body && { body: DOMPurify.sanitize(translation.body) }),
    }))

  return {
    id: recordedEvent.id,
    publishDate: recordedEvent.publishDate,
    translations: translationsProcessed,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    youtubeId: recordedEvent.youtubeId!,
    ...(processedRecordedEventType && {
      recordedEventType: processedRecordedEventType,
    }),
  }
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
        title: DOMPurify.sanitize(translation.title!),
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
