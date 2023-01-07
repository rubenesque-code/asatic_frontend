import { removeArrDuplicates } from "^helpers/general"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedCollection,
  SanitisedRecordedEvent,
} from "^types/entities"
import { getArticleLikeDocumentImageIds } from "../article-like"

export function getCollectionAsChildUniqueImageIds(
  collection: SanitisedCollection
) {
  const imageIds = [
    collection.bannerImage.imageId,
    collection.summaryImage.imageId,
  ].flatMap((imageId) => (imageId ? [imageId] : []))

  const unique = Array.from(new Set(imageIds).values())

  return unique
}

export function getCollectionSummaryText(
  translation: SanitisedCollection["translations"][number]
) {
  if (translation.summary.general?.length) {
    return translation.summary.general
  }
  if (translation.description?.length) {
    return translation.description
  }

  return null
}

export function getCollectionsUniqueImageIds(
  collections: SanitisedCollection[]
) {
  const uniqueImageIds = removeArrDuplicates(
    collections.flatMap((collection) =>
      collection.bannerImage.imageId ? [collection.bannerImage.imageId] : []
    )
  )

  return uniqueImageIds
}

export function getCollectionUniqueChildImageIds({
  articles,
  blogs,
  recordedEvents,
}: {
  articles: SanitisedArticle[]
  blogs: SanitisedBlog[]
  recordedEvents: SanitisedRecordedEvent[]
}) {
  const articleAndBlogImageIds = [...articles, ...blogs].flatMap(
    (articleLikeEntity) =>
      getArticleLikeDocumentImageIds(articleLikeEntity.translations)
  )
  const recordedEventImageIds = recordedEvents.flatMap((recordedEvent) =>
    recordedEvent.summaryImage.imageId
      ? [recordedEvent.summaryImage.imageId]
      : []
  )

  const unique = removeArrDuplicates([
    ...articleAndBlogImageIds,
    ...recordedEventImageIds,
  ])

  return unique
}
