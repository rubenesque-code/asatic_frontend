import { mapIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"
import {
  filterValidArticleLikeEntities,
  filterValidCollections,
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
import { fetchAndValidateLanguages } from "./languages"

export async function fetchAndValidateSubjects() {
  const fetched = await fetchSubjects()

  if (!fetched.length) {
    return {
      entities: [],
      ids: [],
    }
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

  return {
    entities: validSubjects,
    ids: mapIds(validSubjects),
  }
}

export async function fetchAndValidateGlobalData() {
  const subjects = await fetchAndValidateSubjects()
  const languages = await fetchAndValidateLanguages()

  return {
    subjects,
    languages,
  }
}
