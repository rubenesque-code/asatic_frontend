import {
  ArticleLikeTranslation,
  SanitisedArticle,
  SanitisedBlog,
} from "^types/entities"

const checkTranslationHasText = (translation: ArticleLikeTranslation) => {
  const textSections = translation.body.flatMap((section) =>
    section.type === "text" ? [section] : []
  )

  const isSectionWithText = textSections.find((s) => s.text?.length)

  return Boolean(isSectionWithText)
}

export function validateTranslation(
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
export function filterValidArticleLikeEntities<
  TEntity extends SanitisedArticle | SanitisedBlog
>(entities: TEntity[], validLanguageIds: string[]) {
  return entities.filter((entity) =>
    validateArticleLikeEntity(entity, validLanguageIds)
  )
}
