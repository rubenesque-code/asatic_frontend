import { SanitisedCollection } from "^types/entities"

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
