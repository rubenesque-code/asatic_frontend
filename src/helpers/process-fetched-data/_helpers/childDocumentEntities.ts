import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { fetchImages } from "^lib/firebase/firestore"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
} from "^types/entities"
import { processArticleLikeEntityAsSummary } from "../article-like"
import { getUniqueChildEntitiesIds } from "../general"
import { processRecordedEventAsSummary } from "../recorded-event/process"
import { getRecordedEventTypeIds } from "../recorded-event/query"
import { getUniqueDocumentEntitiesImageIds } from "./query"

export async function handleProcessOfChildDocumentEntities({
  articles,
  blogs,
  recordedEvents,
  validLanguageIds,
}: {
  articles: SanitisedArticle[]
  blogs: SanitisedBlog[]
  recordedEvents: SanitisedRecordedEvent[]
  validLanguageIds: string[]
}) {
  const imageIds = getUniqueDocumentEntitiesImageIds({
    articles,
    blogs,
    recordedEvents,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getUniqueChildEntitiesIds(
    [...articles, ...blogs, ...recordedEvents],
    ["authorsIds"]
  ).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds,
  })

  const recordedEventTypeIds = getRecordedEventTypeIds(recordedEvents)
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: recordedEventTypeIds,
    validLanguageIds,
  })

  const processDocumentEntitySharedArgs = {
    validAuthors: validAuthors.entities,
    validImages: fetchedImages,
    validLanguageIds,
  }

  const processedArticles = articles.map((article) =>
    processArticleLikeEntityAsSummary({
      entity: article,
      ...processDocumentEntitySharedArgs,
    })
  )
  const processedBlogs = blogs.map((blog) =>
    processArticleLikeEntityAsSummary({
      entity: blog,
      ...processDocumentEntitySharedArgs,
    })
  )
  const processedRecordedEvents = recordedEvents.map((recordedEvent) =>
    processRecordedEventAsSummary({
      recordedEvent,
      validRecordedEventTypes: validRecordedEventTypes.entities,
      ...processDocumentEntitySharedArgs,
    })
  )

  return {
    articles: processedArticles,
    blogs: processedBlogs,
    recordedEvents: processedRecordedEvents,
  }
}
