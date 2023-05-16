import { filterArr1ByArr2 } from "^helpers/data"
import { SanitisedCollection } from "^types/entities"

const validateCollection = (
  collection: SanitisedCollection,
  {
    validImageIds,
    validLanguageIds,
  }: {
    validImageIds: string[]
    validLanguageIds: string[]
  }
) => {
  if (!validLanguageIds.includes(collection.languageId)) {
    return false
  }
  if (!collection.bannerImage.imageId) {
    return false
  }

  if (!validImageIds.includes(collection.bannerImage.imageId)) {
    return false
  }

  const hasTitle = collection.title

  if (!hasTitle) {
    return false
  }

  return true
}

/** If collection is child of document entity, will have a related document entitiy (so don't need to check for it) */
export function validateCollectionAsChildOfDocumentEntity(
  collection: SanitisedCollection,
  {
    validImageIds,
    validLanguageIds,
  }: {
    validImageIds: string[]
    validLanguageIds: string[]
  }
) {
  return validateCollection(collection, { validImageIds, validLanguageIds })
}

export function validateCollectionAsParent(
  collection: SanitisedCollection,
  {
    validDocumentEntityIds,
    validImageIds,
    validLanguageIds,
  }: {
    validImageIds: string[]
    validLanguageIds: string[]
    validDocumentEntityIds: {
      articles: string[]
      blogs: string[]
      recordedEvents: string[]
    }
  }
) {
  const isSelfValid = validateCollection(collection, {
    validImageIds,
    validLanguageIds,
  })

  if (!isSelfValid) {
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

export function filterValidCollections(
  collections: SanitisedCollection[],
  {
    validDocumentEntityIds,
    validImageIds,
    validLanguageIds,
  }: {
    validImageIds: string[]
    validLanguageIds: string[]
    validDocumentEntityIds: {
      articles: string[]
      blogs: string[]
      recordedEvents: string[]
    }
  }
) {
  return collections.filter((collection) =>
    validateCollectionAsParent(collection, {
      validDocumentEntityIds,
      validImageIds,
      validLanguageIds,
    })
  )
}

export function filterValidCollectionsAsChildren(
  collections: SanitisedCollection[],
  {
    validImageIds,
    validLanguageIds,
  }: {
    validImageIds: string[]
    validLanguageIds: string[]
  }
) {
  return collections.filter((collection) =>
    validateCollectionAsChildOfDocumentEntity(collection, {
      validImageIds,
      validLanguageIds,
    })
  )
}
