import { removeArrDuplicates } from "^helpers/general"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedCollection,
  SanitisedRecordedEvent,
} from "^types/entities"
import { getArticleLikeDocumentImageIds } from "../article-like"
import { getCollectionAsChildUniqueImageIds } from "../collection/query"

export function getSubjectChildImageIds({
  articles,
  blogs,
  recordedEvents,
  collections,
}: {
  articles: SanitisedArticle[]
  blogs: SanitisedBlog[]
  recordedEvents: SanitisedRecordedEvent[]
  collections: SanitisedCollection[]
}) {
  const articleAndBlogImageIds = [...articles, ...blogs].flatMap(
    (articleLikeEntity) =>
      getArticleLikeDocumentImageIds(articleLikeEntity.translations)
  )
  const recordedEventImageIds = recordedEvents.flatMap((recordedEvent) =>
    recordedEvent.summaryImage.imageId
      ? [recordedEvent.summaryImage.imageId]
      : []
  )
  const collectionImageIds = collections.flatMap((collection) =>
    getCollectionAsChildUniqueImageIds(collection)
  )

  const unique = removeArrDuplicates([
    ...articleAndBlogImageIds,
    ...recordedEventImageIds,
    ...collectionImageIds,
  ])

  return unique
}
