import { fetchAndValidateArticles } from "../articles"
import { fetchAndValidateBlogs } from "../blogs"
import { fetchAndValidateRecordedEvents } from "../recordedEvents"

export async function fetchAndValidateDocumentEntities({
  articleIds,
  blogIds,
  recordedEventIds,
  validLanguageIds,
}: {
  articleIds: string[]
  blogIds: string[]
  recordedEventIds?: string[]
  validLanguageIds?: string[]
}) {
  return {
    articles: await fetchAndValidateArticles({
      ids: articleIds,
      validLanguageIds,
    }),
    blogs: await fetchAndValidateBlogs({
      ids: blogIds,
      validLanguageIds,
    }),
    recordedEvents: recordedEventIds
      ? await fetchAndValidateRecordedEvents({
          ids: recordedEventIds,
          validLanguageIds,
        })
      : null,
  }
}
