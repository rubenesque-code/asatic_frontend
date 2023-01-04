import { findEntityById } from "^helpers/data"
import { Image, SanitisedCollection } from "^types/entities"
import { getCollectionSummaryText } from "./query"
import { filterValidTranslations } from "./validate"

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
