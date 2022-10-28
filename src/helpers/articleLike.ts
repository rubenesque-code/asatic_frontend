import { ArticleLikeTranslation } from '^types/article-like-entity'

export function getArticleLikeDocumentImageIds(
  articleLikeTranslations: ArticleLikeTranslation[]
) {
  const imageIds = articleLikeTranslations
    .flatMap((t) => t.body)
    .flatMap((s) => (s.type === 'image' ? [s] : []))
    .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []))

  const unique = Array.from(new Set(imageIds).values())

  return unique
}
