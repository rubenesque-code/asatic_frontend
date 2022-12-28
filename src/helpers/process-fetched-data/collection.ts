import { Collection, CollectionTranslation } from "^types/entities"

const validateTranslation = (
  translation: CollectionTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId)
  const isTitle = translation.title?.length
  const isDescription = translation.description?.length

  return Boolean(languageIsValid && isTitle && isDescription)
}

export function validateCollectionAsChild(
  collection: Collection,
  validLanguageIds: string[]
) {
  if (collection.publishStatus !== "published") {
    return false
  }

  if (!collection.bannerImage.imageId) {
    return false
  }

  const validTranslation = collection.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}

export function filterValidCollectionsAsChildren(
  collections: Collection[],
  validLanguageIds: string[]
) {
  return collections.filter(async (collection) =>
    validateCollectionAsChild(collection, validLanguageIds)
  )
}
