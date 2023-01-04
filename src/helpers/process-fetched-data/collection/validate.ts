import { filterArr1ByArr2 } from "^helpers/data"
import { SanitisedCollection, CollectionTranslation } from "^types/entities"

const validateTranslation = (
  translation: CollectionTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId)
  const isTitle = translation.title?.length
  const isDescription = translation.description?.length

  return Boolean(languageIsValid && isTitle && isDescription)
}

function findValidTranslation(
  translations: CollectionTranslation[],
  validLanguageIds: string[]
) {
  const translation = translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )
  if (translation) {
    return translation as Required<CollectionTranslation>
  }
  return translation
}

export function filterValidTranslations(
  translations: CollectionTranslation[],
  validLanguageIds: string[]
) {
  return translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as Required<CollectionTranslation>[]
}

/** If collection is child of document entity, will have a related document entitiy (so don't need to check for it) */
export function validateCollectionAsChildOfDocumentEntity({
  collection,
  validLanguageIds,
}: {
  collection: SanitisedCollection
  validLanguageIds: string[]
}) {
  if (!collection.bannerImage.imageId) {
    return false
  }

  const validTranslation = findValidTranslation(
    collection.translations,
    validLanguageIds
  )

  if (!validTranslation) {
    return false
  }

  return true
}

export function validateCollection({
  collection,
  validDocumentEntityIds,
  validLanguageIds,
}: {
  collection: SanitisedCollection
  validLanguageIds: string[]
  validDocumentEntityIds: {
    articles: string[]
    blogs: string[]
    recordedEvents: string[]
  }
}) {
  if (!collection.bannerImage.imageId) {
    return false
  }

  const validTranslation = findValidTranslation(
    collection.translations,
    validLanguageIds
  )

  if (!validTranslation) {
    return false
  }

  const validChildArticles = filterArr1ByArr2(
    collection.articlesIds,
    validDocumentEntityIds.articles
  )
  const validChildBlogs = filterArr1ByArr2(
    collection.blogsIds,
    validDocumentEntityIds.blogs
  )
  const validChildRecordedEvents = filterArr1ByArr2(
    collection.recordedEventsIds,
    validDocumentEntityIds.recordedEvents
  )

  const isPopulated =
    validChildArticles.length ||
    validChildBlogs.length ||
    validChildRecordedEvents.length

  if (!isPopulated) {
    return false
  }

  return true
}

export function filterValidCollections({
  collections,
  validDocumentEntityIds,
  validLanguageIds,
  collectionRelation,
}: {
  collections: SanitisedCollection[]
  validLanguageIds: string[]
  validDocumentEntityIds: {
    articles: string[]
    blogs: string[]
    recordedEvents: string[]
  }
  collectionRelation: "child-of-document" | "default"
}) {
  return collections.filter((collection) =>
    collectionRelation === "default"
      ? validateCollection({
          collection,
          validDocumentEntityIds,
          validLanguageIds,
        })
      : validateCollectionAsChildOfDocumentEntity({
          collection,
          validLanguageIds,
        })
  )
}
