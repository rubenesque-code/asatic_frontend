import { fetchCollections, fetchImages } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import {
  filterValidCollections,
  filterValidCollectionsAsChildren,
} from "^helpers/process-fetched-data/collection/validate"
import { fetchAndValidateArticles } from "./articles"
import { fetchAndValidateBlogs } from "./blogs"
import { fetchAndValidateRecordedEvents } from "./recordedEvents"
import {
  getCollectionUniqueChildImageIds,
  getCollectionsUniqueImageIds,
} from "^helpers/process-fetched-data/collection/query"

export async function fetchAndValidateCollections({
  collectionRelation = "default",
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  collectionRelation?: "child-of-document" | "default"
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedCollections = await fetchCollections(ids)

  if (!fetchedCollections.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  if (collectionRelation === "child-of-document") {
    const imageIds = getCollectionsUniqueImageIds(fetchedCollections)
    const fetchedImages = await fetchImages(imageIds)
    const validImageIds = mapIds(fetchedImages)

    const validCollections = filterValidCollectionsAsChildren(
      fetchedCollections,
      {
        validImageIds,
        validLanguageIds,
      }
    )

    return {
      entities: validCollections,
      ids: mapIds(validCollections),
    }
  }

  const childIds = getUniqueChildEntitiesIds(fetchedCollections, [
    "articlesIds",
    "blogsIds",
    "recordedEventsIds",
  ])

  const validArticles = await fetchAndValidateArticles({
    ids: childIds.articlesIds,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: childIds.blogsIds,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: childIds.blogsIds,
    validLanguageIds,
  })

  const imageIds = [
    ...getCollectionsUniqueImageIds(fetchedCollections),
    ...getCollectionUniqueChildImageIds({
      articles: validArticles.entities,
      blogs: validBlogs.entities,
      recordedEvents: validRecordedEvents.entities,
    }),
  ]
  const fetchedImages = await fetchImages(imageIds)
  const validImageIds = mapIds(fetchedImages)

  const validCollections = filterValidCollections(fetchedCollections, {
    validDocumentEntityIds: {
      articles: validArticles.ids,
      blogs: validBlogs.ids,
      recordedEvents: validRecordedEvents.ids,
    },
    validImageIds,
    validLanguageIds,
  })

  return {
    entities: validCollections,
    ids: mapIds(validCollections),
  }
}
