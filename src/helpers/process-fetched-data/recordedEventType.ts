import produce from "immer"

import {
  Author,
  AuthorChildEntitiesKeysTuple,
  AuthorRelatedEntityFields,
  RecordedEventType,
  RecordedEventTypeTranslation,
} from "^types/entities"

const validateTranslation = (
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

export function filterValidAuthorsAsChildren(
  recordedEventTypes: RecordedEventType[],
  validLanguageIds: string[]
) {
  return recordedEventTypes.filter(async (author) =>
    validateRecordedEventTypeAsChild(author, validLanguageIds)
  )
}

export function validateAuthorAsParent(
  author: Author,
  validLanguageIds: string[],
  validChildrenIds: AuthorRelatedEntityFields
) {
  const hasValidTranslation = author.translations.find(
    (translation) =>
      translation.name?.length &&
      validLanguageIds.includes(translation.languageId)
  )

  if (!hasValidTranslation) {
    return false
  }

  const isUsed =
    validChildrenIds.articlesIds.length ||
    validChildrenIds.blogsIds.length ||
    validChildrenIds.recordedEventsIds.length

  if (!isUsed) {
    return false
  }

  return true
}

export function filterValidAuthorsAsParents(
  authors: Author[],
  validLanguageIds: string[],
  validChildrenIds: AuthorRelatedEntityFields
) {
  return authors.filter((author) =>
    validateAuthorAsParent(author, validLanguageIds, validChildrenIds)
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

/**Used within getStaticProps after validation has occurred in getStaticPaths; remove invalid translations and child entities.*/
export function processValidatedAuthor({
  entity,
  validLanguageIds,
  validRelatedEntitiesIds,
}: {
  entity: Author
  validLanguageIds: string[]
  validRelatedEntitiesIds: AuthorRelatedEntityFields
}) {
  const processed = produce(entity, (draft) => {
    // remove invalid translations: start ---
    for (let i = 0; i < draft.translations.length; i++) {
      const translation = draft.translations[i]
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
    }
    // remove invalid translations: end ---

    const childKeysArr: AuthorChildEntitiesKeysTuple = [
      "articlesIds",
      "blogsIds",
      "recordedEventsIds",
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
