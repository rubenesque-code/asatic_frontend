import produce from "immer"
import {
  ArticleLikeTranslation,
  ArticleLikeChildEntitiesKeysTuple,
  ArticleLikeChildEntityFields,
  SanitisedArticle,
  SanitisedBlog,
} from "^types/entities"

export function getArticleLikeDocumentImageIds(
  articleLikeTranslations: ArticleLikeTranslation[]
) {
  const imageIds = articleLikeTranslations
    .flatMap((t) => t.body)
    .flatMap((s) => (s.type === "image" ? [s] : []))
    .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []))

  const unique = Array.from(new Set(imageIds).values())

  return unique
}

const checkTranslationHasText = (translation: ArticleLikeTranslation) => {
  const textSections = translation.body.flatMap((section) =>
    section.type === "text" ? [section] : []
  )

  const isSectionWithText = textSections.find((s) => s.text?.length)

  return Boolean(isSectionWithText)
}

function validateTranslation(
  translation: ArticleLikeTranslation,
  languageIds: string[]
) {
  if (!languageIds.includes(translation.languageId)) {
    return false
  }
  if (!translation.title?.length) {
    return false
  }
  if (!checkTranslationHasText(translation)) {
    return false
  }
  return true
}

export function validateArticleLikeEntity<
  TEntity extends SanitisedArticle | SanitisedBlog
>(entity: TEntity, validLanguageIds: string[]): boolean {
  const validTranslation = entity.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}
export function filterValidArticleLikeEntity(
  entities: (SanitisedArticle | SanitisedBlog)[],
  validLanguageIds: string[]
) {
  return entities.filter((entity) =>
    validateArticleLikeEntity(entity, validLanguageIds)
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
export function processValidatedArticleLikeEntity<
  TEntity extends SanitisedArticle | SanitisedBlog
>({
  entity,
  validRelatedEntitiesIds,
}: {
  entity: TEntity
  validRelatedEntitiesIds: {
    languagesIds: string[]
  } & ArticleLikeChildEntityFields
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

    const articleLikeChildKeysArr: ArticleLikeChildEntitiesKeysTuple = [
      "authorsIds",
      "collectionsIds",
      "subjectsIds",
      "tagsIds",
    ]

    articleLikeChildKeysArr.forEach((key) =>
      removeInvalidChildEntityIds({
        childEntityIdArr: draft[key],
        validIdArr: validRelatedEntitiesIds[key],
      })
    )
  })

  return processed
}
