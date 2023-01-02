import { ArticleLikeSummaryType, SanitisedArticle } from "^types/entities"

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

export const getArticleLikeSummary = (
  translation: Translation,
  summaryType: ArticleLikeSummaryType
) => {
  const { body, summary } = translation

  if (summaryType === "default") {
    if (summary.general?.length) {
      return summary.general
    }
    if (summary.collection?.length) {
      return summary.collection
    }
    if (summary.landingCustomSection?.length) {
      return summary.landingCustomSection
    }
  }

  if (summaryType === "collection") {
    if (summary.collection?.length) {
      return summary.collection
    }
    if (summary.landingCustomSection?.length) {
      return summary.landingCustomSection
    }
    if (summary.general?.length) {
      return summary.general
    }
  }

  if (summaryType === "landing-user-section") {
    if (summary.landingCustomSection?.length) {
      return summary.landingCustomSection
    }
    if (summary.collection?.length) {
      return summary.collection
    }
    if (summary.general?.length) {
      return summary.general
    }
  }

  const textSections = body.flatMap((s) => (s.type === "text" ? [s] : []))
  const firstTextSectionWithText = textSections.find(
    (textSection) => textSection.text?.length
  )

  if (!firstTextSectionWithText) {
    return null
  }

  return firstTextSectionWithText.text
}
