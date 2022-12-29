import { mapIds } from "^helpers/data"
import {
  filterValidArticleLikeEntities,
  filterValidAuthorsAsParents,
  getUniqueChildEntityIdsOfParents,
} from "^helpers/process-fetched-data"
import { filterValidRecordedEvents } from "^helpers/process-fetched-data/recordedEvent"
import {
  fetchArticles,
  fetchAuthors,
  fetchBlogs,
  fetchRecordedEvents,
} from "^lib/firebase/firestore"
import { fetchAndValidateLanguages } from "./global"

export async function fetchAndValidateAuthors() {
  const fetched = await fetchAuthors()

  if (!fetched.length) {
    return []
  }

  const allValidLanguages = await fetchAndValidateLanguages()
  const allValidLanguagesIds = mapIds(allValidLanguages)

  const childrenIds = {
    articles: getUniqueChildEntityIdsOfParents(fetched, "articlesIds"),
    blogs: getUniqueChildEntityIdsOfParents(fetched, "blogsIds"),
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
    recordedEvents: !childrenIds.recordedEvents.length
      ? []
      : await fetchRecordedEvents(childrenIds.recordedEvents),
  }

  const childrenValidated = {
    articles: filterValidArticleLikeEntities(
      childrenFetched.articles,
      allValidLanguagesIds
    ),
    blogs: filterValidArticleLikeEntities(
      childrenFetched.blogs,
      allValidLanguagesIds
    ),
    recordedEvents: filterValidRecordedEvents(
      childrenFetched.recordedEvents,
      allValidLanguagesIds
    ),
  }

  const validAuthors = filterValidAuthorsAsParents(
    fetched,
    allValidLanguagesIds,
    {
      articlesIds: mapIds(childrenValidated.articles),
      blogsIds: mapIds(childrenValidated.blogs),
      recordedEventsIds: mapIds(childrenValidated.recordedEvents),
    }
  )

  return validAuthors
}
