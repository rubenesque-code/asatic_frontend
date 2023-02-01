import DOMPurify from "isomorphic-dompurify"

import { findEntityById } from "^helpers/data"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { Image, SanitisedCollection } from "^types/entities"
import { ArticleLikeEntityAsSummary } from "../article-like"
import { RecordedEventAsSummary } from "../recorded-event/process"
import { getCollectionSummaryText } from "./query"

export type CollectionAsSummary = ReturnType<typeof processCollectionAsSummary>

export function processCollectionAsSummary(
  collection: SanitisedCollection,
  {
    validImages,
  }: {
    validImages: Image[]
  }
) {
  let summaryImage: Image | null = null

  if (collection.summaryImage.imageId) {
    summaryImage =
      findEntityById(validImages, collection.summaryImage.imageId) || null
  }
  if (!summaryImage && collection.bannerImage.imageId) {
    summaryImage =
      findEntityById(validImages, collection.bannerImage.imageId) || null
  }

  const summaryText = getCollectionSummaryText(collection)

  return {
    id: collection.id,
    type: collection.type,
    publishDate: collection.publishDate,
    summaryImage: summaryImage
      ? {
          vertPosition: collection.summaryImage.vertPosition,
          storageImage: summaryImage,
        }
      : null,
    title: DOMPurify.sanitize(collection.title),
    languageId: collection.languageId,
    ...(summaryText && { text: DOMPurify.sanitize(summaryText) }),
  }
}

export function processCollectionsAsSummaries(
  collections: SanitisedCollection[],
  {
    validImages,
  }: {
    validImages: Image[]
  }
) {
  return collections.map((collection) =>
    processCollectionAsSummary(collection, { validImages })
  )
}

/**occurs after validation; requirements already met. */
export function processCollectionForOwnPage(
  collection: SanitisedCollection,
  {
    validImages,
    processedChildDocumentEntities,
  }: {
    validImages: Image[]
    processedChildDocumentEntities: {
      articles: ArticleLikeEntityAsSummary[]
      blogs: ArticleLikeEntityAsSummary[]
      recordedEvents: RecordedEventAsSummary[]
    }
  }
) {
  const bannerImage = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    storageImage: findEntityById(validImages, collection.bannerImage.imageId!)!,
    vertPosition: collection.bannerImage.vertPosition || 50,
  }

  const orderedChildDocumentEntities = sortEntitiesByDate(
    Object.values(processedChildDocumentEntities).flat()
  )

  return {
    id: collection.id,
    publishDate: collection.publishDate,
    bannerImage,
    title: DOMPurify.sanitize(collection.title),
    childDocumentEntities: orderedChildDocumentEntities,
    languageId: collection.languageId,
    ...(collection.description && {
      description: DOMPurify.sanitize(collection.description),
    }),
  }
}
