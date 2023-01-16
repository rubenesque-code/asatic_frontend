import { findEntityById } from "^helpers/data"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { Image, SanitisedCollection } from "^types/entities"
import { ArticleLikeEntityAsSummary } from "../article-like"
import { RecordedEventAsSummary } from "../recorded-event/process"
import { getCollectionSummaryText } from "./query"
import {
  filterValidTranslations,
  validateTranslation,
  ValidTranslation,
} from "./validate"

function processTranslationForSummary(
  translation: SanitisedCollection["translations"][number]
) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    title: translation.title!,
    languageId: translation.languageId,
    summaryText: getCollectionSummaryText(translation),
  }
}

export type CollectionAsSummary = ReturnType<typeof processCollectionAsSummary>

export function processCollectionAsSummary(
  collection: SanitisedCollection,
  {
    validImages,
    validLanguageIds,
  }: {
    validImages: Image[]
    validLanguageIds: string[]
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

  const validTranslations = filterValidTranslations(
    collection.translations,
    validLanguageIds
  )
  const processedTranslations = validTranslations.map((translation) =>
    processTranslationForSummary(translation)
  )

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
    translations: processedTranslations,
  }
}

export function processCollectionForOwnPage(
  collection: SanitisedCollection,
  {
    validLanguageIds,
    validImages,
    processedChildDocumentEntities,
  }: {
    validLanguageIds: string[]
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

  const validTranslations = collection.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as ValidTranslation[]

  const orderedChildDocumentEntities = sortEntitiesByDate(
    Object.values(processedChildDocumentEntities).flat()
  )

  return {
    id: collection.id,
    publishDate: collection.publishDate,
    bannerImage,
    translations: validTranslations,
    childDocumentEntities: orderedChildDocumentEntities,
  }
}
