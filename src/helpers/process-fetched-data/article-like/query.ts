import { SanitisedArticle } from "^types/entities"

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
