import { mapIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"
import {
  filterValidArticleLikeEntities,
  filterValidCollections,
  filterValidLanguages,
  filterValidSubjects,
  getUniqueChildEntityIdsOfParents,
} from "^helpers/process-fetched-data"
import { filterValidRecordedEvents } from "^helpers/process-fetched-data/recordedEvent"
import {
  fetchArticles,
  fetchBlogs,
  fetchCollections,
  fetchLanguages,
  fetchRecordedEvents,
  fetchSubjects,
} from "^lib/firebase/firestore"

export async function fetchAndValidateSubjects() {
  const fetched = await fetchSubjects()

  if (!fetched.length) {
    return []
  }

  const childrenIds = {
    languages: removeArrDuplicates(
      fetched.flatMap((subject) =>
        subject.translations.flatMap((t) => t.languageId)
      )
    ),
    articles: getUniqueChildEntityIdsOfParents(fetched, "articlesIds"),
    blogs: getUniqueChildEntityIdsOfParents(fetched, "blogsIds"),
    collections: getUniqueChildEntityIdsOfParents(fetched, "collectionsIds"),
    recordedEvents: getUniqueChildEntityIdsOfParents(
      fetched,
      "recordedEventsIds"
    ),
  }

  const childrenFetched = {
    languages: await fetchLanguages(childrenIds.languages),
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

  const validLanguageIds = mapIds(childrenFetched.languages)

  const childrenValidated = {
    articles: filterValidArticleLikeEntities(
      childrenFetched.articles,
      validLanguageIds
    ),
    blogs: filterValidArticleLikeEntities(
      childrenFetched.blogs,
      validLanguageIds
    ),
    collections: filterValidCollections(
      childrenFetched.collections,
      validLanguageIds
    ),
    recordedEvents: filterValidRecordedEvents(
      childrenFetched.recordedEvents,
      validLanguageIds
    ),
  }

  const validSubjects = filterValidSubjects(fetched, {
    articleIds: mapIds(childrenValidated.articles),
    blogIds: mapIds(childrenValidated.blogs),
    collectionIds: mapIds(childrenValidated.collections),
    languageIds: validLanguageIds,
    recordedEventIds: mapIds(childrenValidated.recordedEvents),
  })

  return validSubjects
}

export async function fetchAndValidateLanguages() {
  const fetched = await fetchLanguages()

  if (!fetched.length) {
    return []
  }

  return filterValidLanguages(fetched)
}
