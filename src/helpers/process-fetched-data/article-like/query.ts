import { stripHtml } from "string-strip-html"

import { SanitisedArticle, SanitisedBlog } from "^types/entities"

type Translation = SanitisedArticle["translations"][number]

export function getArticleLikeDocumentImageIds(
  articleLikeTranslations: Translation[]
) {
  const imageIds = articleLikeTranslations
    .flatMap((t) => t.body)
    .flatMap((s) => (s.type === "image" ? [s] : []))
    .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []))

  const unique = Array.from(new Set(imageIds).values())

  return unique
}

export function getArticleLikeEntitiesDocumentImageIds(
  entities: (SanitisedArticle | SanitisedBlog)[]
) {
  return entities.flatMap((entity) =>
    getArticleLikeDocumentImageIds(entity.translations)
  )
}

export function getArticleLikeSummaryImageId(
  articleLikeEntity: SanitisedArticle | SanitisedBlog
) {
  if (articleLikeEntity.summaryImage.imageId) {
    return articleLikeEntity.summaryImage.imageId
  }

  const documentImageId = articleLikeEntity.translations
    .flatMap((translation) => translation.body)
    .find((section) => section.type === "image" && section.image.imageId)

  return documentImageId
}

export function getAllImageIdsFromArticleLikeEntity(
  articleLikeEntity: SanitisedArticle | SanitisedBlog
) {
  return [
    articleLikeEntity.summaryImage.imageId,
    ...getArticleLikeDocumentImageIds(articleLikeEntity.translations),
  ].flatMap((id) => (id ? [id] : []))
}

export const getArticleLikeSummaryText = (
  translation: SanitisedArticle["translations"][number]
) => {
  const { body, summary } = translation

  if (summary?.length) {
    return summary
  }

  const textSections = body.flatMap((s) => (s.type === "text" ? [s] : []))
  const firstTextSectionWithText = textSections.find(
    (textSection) => textSection.text?.length
  )

  if (!firstTextSectionWithText?.text?.length) {
    return null
  }

  return stripHtml(firstTextSectionWithText.text).result
}
