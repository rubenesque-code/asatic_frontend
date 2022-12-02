import produce from "immer"
import { Article, Blog, ArticleLikeTranslation } from "^types/entities"

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

export function validateArticleLikeEntity<TEntity extends Article | Blog>(
  entity: TEntity,
  validLanguageIds: string[]
): boolean {
  // valid article: published; at least 1 translation with valid language, title and body text
  if (entity.publishStatus !== "published") {
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

/**Used within getStaticProps after validation has occurred in getStaticPaths  */
export function processValidatedArticleLikeEntity<
  TEntity extends Article | Blog
>({
  entity,
  validRelatedEntitiesIds,
}: {
  entity: TEntity
  validRelatedEntitiesIds: {
    languages: string[]
    authors: string[]
    collections: string[]
    subjects: string[]
    tags: string[]
  }
}) {
  const processed = produce(entity, (draft) => {
    for (let i = 0; i < draft.translations.length; i++) {
      const translation = draft.translations[i]
      const translationIsValid = validateTranslation(
        translation,
        validRelatedEntitiesIds.languages
      )

      if (!translationIsValid) {
        const translationIndex = entity.translations.findIndex(
          (t) => t.id === translation.id
        )
        entity.translations.splice(translationIndex, 1)
      }
    }

    for (let i = 0; i < draft.authorsIds.length; i++) {
      const authorId = draft.authorsIds[i]
      if (!validRelatedEntitiesIds.authors.includes(authorId)) {
        const index = entity.authorsIds.findIndex((id) => id === authorId)
        entity.authorsIds.splice(index, 1)
      }
    }

    for (let i = 0; i < draft.collectionsIds.length; i++) {
      const collectionId = draft.collectionsIds[i]
      if (!validRelatedEntitiesIds.collections.includes(collectionId)) {
        const index = entity.collectionsIds.findIndex(
          (id) => id === collectionId
        )
        entity.collectionsIds.splice(index, 1)
      }
    }

    for (let i = 0; i < draft.subjectsIds.length; i++) {
      const subjectId = draft.subjectsIds[i]
      if (!validRelatedEntitiesIds.subjects.includes(subjectId)) {
        const index = entity.subjectsIds.findIndex((id) => id === subjectId)
        entity.subjectsIds.splice(index, 1)
      }
    }

    for (let i = 0; i < draft.tagsIds.length; i++) {
      const tagId = draft.tagsIds[i]
      if (!validRelatedEntitiesIds.tags.includes(tagId)) {
        const index = entity.tagsIds.findIndex((id) => id === tagId)
        entity.tagsIds.splice(index, 1)
      }
    }
  })

  return processed
}
