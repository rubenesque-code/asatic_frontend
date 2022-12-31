import produce from "immer"

import {
  SanitisedRecordedEvent,
  RecordedEventTranslation,
  RecordedEventChildEntityFields,
  EntityNameToChildKeyTuple,
  EntityNameTupleSubset,
  RecordedEventType,
} from "^types/entities"
import { MakeRequired, MyOmit } from "^types/utilities"

function validateTranslation(
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

const removeInvalidChildEntityIds = ({
  childEntityIdArr,
  validIdArr,
}: {
  childEntityIdArr: string[]
  validIdArr: string[]
}) => {
  childEntityIdArr.forEach((id, i) => {
    if (!validIdArr.includes(id)) {
      childEntityIdArr.splice(i, 1)
    }
  })
}

/**Used within getStaticProps after validation has occurred in getStaticPaths  */
export function processValidatedRecordedEvent<
  TEntity extends SanitisedRecordedEvent
>({
  entity,
  validLanguageIds,
  validRelatedEntitiesIds,
  recordedEventTypeIsValid,
}: {
  entity: TEntity
  validLanguageIds: string[]
  validRelatedEntitiesIds: MyOmit<
    RecordedEventChildEntityFields,
    "recordedEventTypeId"
  >
  recordedEventTypeIsValid: boolean
}) {
  const processed = produce(entity, (draft) => {
    for (let i = 0; i < draft.translations.length; i++) {
      const translation = draft.translations[i]
      // remove invalid translations: start ---
      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        const translationIndex = draft.translations.findIndex(
          (t) => t.id === translation.id
        )
        draft.translations.splice(translationIndex, 1)
      }
      // remove invalid translations: end ---
    }

    if (!recordedEventTypeIsValid) {
      draft.recordedEventTypeId = null
    }

    type ChildKeysArr = EntityNameToChildKeyTuple<
      EntityNameTupleSubset<"author" | "collection" | "subject" | "tag">
    >

    const childKeysArr: ChildKeysArr = [
      "authorsIds",
      "collectionsIds",
      "subjectsIds",
      "tagsIds",
    ]

    childKeysArr.forEach((key) =>
      removeInvalidChildEntityIds({
        childEntityIdArr: draft[key],
        validIdArr: validRelatedEntitiesIds[key],
      })
    )
  })

  return processed
}

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
