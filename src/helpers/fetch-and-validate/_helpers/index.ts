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
  const articles = await fetchAndValidateArticles({
    ids: articleIds,
    validLanguageIds,
  })
  const blogs = await fetchAndValidateBlogs({
    ids: blogIds,
    validLanguageIds,
  })
  const recordedEvents = recordedEventIds
    ? await fetchAndValidateRecordedEvents({
        ids: recordedEventIds,
        validLanguageIds,
      })
    : null

  return {
    articles,
    blogs,
    recordedEvents,
  }
}
