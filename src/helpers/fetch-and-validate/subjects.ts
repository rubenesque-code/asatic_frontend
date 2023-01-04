import { fetchSubjects } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidSubjects } from "^helpers/process-fetched-data/subject/validate"
import { getUniqueChildEntityIds } from "^helpers/process-fetched-data/general"
import { fetchAndValidateArticles } from "./articles"
import { fetchAndValidateBlogs } from "./blogs"
import { fetchAndValidateCollections } from "./collections"
import { fetchAndValidateRecordedEvents } from "./recordedEvents"

export async function fetchAndValidateSubjects({
  subjectRelation = "default",
  subjectIds,
  validLanguageIds: passedValidLanguageIds,
}: {
  subjectRelation?: "child-of-document" | "default"
  subjectIds: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedSubjects = await fetchSubjects(subjectIds)

  if (!fetchedSubjects.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  const ids = getUniqueChildEntityIds(fetchedSubjects, [
    "articlesIds",
    "blogsIds",
    "collectionsIds",
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
  const validCollections = await fetchAndValidateCollections({
    collectionIds: ids.collectionsIds,
    validLanguageIds,
    collectionRelation: "default",
  })

  const validSubjects = filterValidSubjects(fetchedSubjects, {
    subjectRelation,
    validChildEntityIds: {
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
