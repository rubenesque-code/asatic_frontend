import {
  fetchArticles,
  fetchBlogs,
  fetchCollections,
  fetchRecordedEvents,
  fetchSubjects,
} from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { getUniqueChildEntityIdsOfParents } from "^helpers/process-fetched-data/general"
import { validateChildren } from "^helpers/process-fetched-data/validate-wrapper"
import { filterValidSubjects } from "^helpers/process-fetched-data/subject/validate"

export async function fetchAndValidateSubjects() {
  const fetched = await fetchSubjects()

  if (!fetched.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const languages = await fetchAndValidateLanguages()

  const childrenIds = {
    articles: getUniqueChildEntityIdsOfParents(fetched, "articlesIds"),
    blogs: getUniqueChildEntityIdsOfParents(fetched, "blogsIds"),
    collections: getUniqueChildEntityIdsOfParents(fetched, "collectionsIds"),
    recordedEvents: getUniqueChildEntityIdsOfParents(
      fetched,
      "recordedEventsIds"
    ),
  }

  const childrenFetched = {
    articles: !childrenIds.articles.length
      ? []
      : await fetchArticles(childrenIds.articles),
    blogs: !childrenIds.blogs.length ? [] : await fetchBlogs(childrenIds.blogs),
    collections: !childrenIds.collections.length
      ? []
      : await fetchCollections(childrenIds.collections),
    recordedEvents: !childrenIds.recordedEvents.length
      ? []
      : await fetchRecordedEvents(childrenIds.recordedEvents),
  }

  const childrenValidated = validateChildren(childrenFetched, languages.ids)

  const validSubjects = filterValidSubjects(fetched, languages.ids, {
    articles: mapIds(childrenValidated.articles),
    blogs: mapIds(childrenValidated.blogs),
    collections: mapIds(childrenValidated.collections),
    recordedEvents: mapIds(childrenValidated.recordedEvents),
  })

  return {
    entities: validSubjects,
    ids: mapIds(validSubjects),
  }
}
