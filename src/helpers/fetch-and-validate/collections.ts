import { fetchCollections } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { getUniqueChildEntityIds } from "^helpers/process-fetched-data/general"
import { filterValidCollections } from "^helpers/process-fetched-data/collection/validate"
import { fetchAndValidateArticles } from "./articles"
import { fetchAndValidateBlogs } from "./blogs"
import { fetchAndValidateRecordedEvents } from "./recordedEvents"

export async function fetchAndValidateCollections({
  collectionRelation = "default",
  collectionIds,
  validLanguageIds: passedValidLanguageIds,
}: {
  collectionRelation: "child-of-document" | "default"
  collectionIds: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedCollections = await fetchCollections(collectionIds)

  if (!fetchedCollections.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  const ids = getUniqueChildEntityIds(fetchedCollections, [
    "articlesIds",
    "blogsIds",
    "recordedEventsIds",
  ])

  const validArticles = await fetchAndValidateArticles({
    ids: ids.articlesIds,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: ids.blogsIds,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: ids.blogsIds,
    validLanguageIds,
  })

  const validCollections = filterValidCollections({
    collections: fetchedCollections,
    validDocumentEntityIds: {
      articles: validArticles.ids,
      blogs: validBlogs.ids,
      recordedEvents: validRecordedEvents.ids,
    },
    validLanguageIds,
    collectionRelation,
  })

  return {
    entities: validCollections,
    ids: mapIds(validCollections),
  }
}
