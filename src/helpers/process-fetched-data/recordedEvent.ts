import produce from "immer"
import {
  SanitisedRecordedEvent,
  RecordedEventTranslation,
  RecordedEventChildEntityFields,
  RecordedEventChildEntitiesKeysTuple,
} from "^types/entities"
import { MyOmit } from "^types/utilities"

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
  childEntityIdVals,
  validIdArr,
}: {
  childEntityIdVals: string[] | string | null | undefined
  validIdArr: string[]
}) => {
  if (!Array.isArray(childEntityIdVals)) {
    if (!childEntityIdVals) {
      return
    }
    if (!validIdArr.includes(childEntityIdVals)) {
      childEntityIdVals = null
      return
    }
    return
  }
  childEntityIdVals.forEach((id, i) => {
    if (!validIdArr.includes(id)) {
      const valsAsserted = childEntityIdVals as string[]
      valsAsserted.splice(i, 1)
    }
  })
}

/**Used within getStaticProps after validation has occurred in getStaticPaths  */
export function processValidatedRecordedEvent<
  TEntity extends SanitisedRecordedEvent
>({
  entity,
  validRelatedEntitiesIds,
}: {
  entity: TEntity
  validRelatedEntitiesIds: {
    languagesIds: string[]
  } & MyOmit<RecordedEventChildEntityFields, "recordedEventTypeId"> & {
      recordedEventTypeId: string[]
    }
}) {
  const processed = produce(entity, (draft) => {
    for (let i = 0; i < draft.translations.length; i++) {
      const translation = draft.translations[i]
      // remove invalid translations: start ---
      const translationIsValid = validateTranslation(
        translation,
        validRelatedEntitiesIds.languagesIds
      )

      if (!translationIsValid) {
        const translationIndex = draft.translations.findIndex(
          (t) => t.id === translation.id
        )
        draft.translations.splice(translationIndex, 1)
      }
      // remove invalid translations: end ---
    }

    const childKeysArr: RecordedEventChildEntitiesKeysTuple = [
      "authorsIds",
      "collectionsIds",
      "recordedEventTypeId",
      "subjectsIds",
      "tagsIds",
    ]

    childKeysArr.forEach((key) =>
      removeInvalidChildEntityIds({
        childEntityIdVals: draft[key],
        validIdArr: validRelatedEntitiesIds[key],
      })
    )
  })

  return processed
}
