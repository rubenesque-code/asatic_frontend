import produce from "immer"

import {
  Author,
  AuthorChildEntitiesKeysTuple,
  AuthorRelatedEntityFields,
} from "^types/entities"
import { validateTranslation, ValidTranslation } from "./validate"

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

export function processAuthor(
  author: Author,
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  const validTranslations = author.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as ValidTranslation[]

  return {
    id: author.id,
    translations: validTranslations,
  }
}

export function processAuthors(
  authors: Author[],
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  return authors.map((author) => processAuthor(author, { validLanguageIds }))
}
