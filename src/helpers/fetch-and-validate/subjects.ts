import { fetchSubjects } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidSubjects } from "^helpers/process-fetched-data/subject/validate"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { fetchAndValidateArticles } from "./articles"
import { fetchAndValidateBlogs } from "./blogs"
import { fetchAndValidateCollections } from "./collections"
import { fetchAndValidateRecordedEvents } from "./recordedEvents"

export async function fetchAndValidateSubjects({
  subjectRelation = "default",
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  subjectRelation?: "child-of-document" | "default"
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedSubjects = await fetchSubjects(ids)

  if (!fetchedSubjects.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  const childIds = getUniqueChildEntitiesIds(fetchedSubjects, [
    "articlesIds",
    "blogsIds",
    "collectionsIds",
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
  const validCollections = await fetchAndValidateCollections({
    ids: childIds.collectionsIds,
    validLanguageIds,
    collectionRelation: "default",
  })

  const validSubjects = filterValidSubjects(fetchedSubjects, {
    subjectRelation,
    validDocumentEntityIds: {
      articles: validArticles.ids,
      blogs: validBlogs.ids,
      collections: validCollections.ids,
      recordedEvents: validRecordedEvents.ids,
    },
    validLanguageIds,
  })

  return {
    entities: validSubjects,
    ids: mapIds(validSubjects),
  }
}
