import { removeArrDuplicates } from "^helpers/general"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedCollection,
  SanitisedRecordedEvent,
} from "^types/entities"
import { getArticleLikeDocumentImageIds } from "../article-like"
import { getAllCollectionImageIds } from "../collection/query"

export function getUniqueDocumentEntitiesImageIds({
  articles,
  blogs,
  recordedEvents,
}: {
  articles: SanitisedArticle[]
  blogs: SanitisedBlog[]
  recordedEvents: SanitisedRecordedEvent[]
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

  const unique = removeArrDuplicates([
    ...articleAndBlogImageIds,
    ...recordedEventImageIds,
  ])

  return unique
}

export function getUniqueChildEntitiesImageIds({
  articleLikeEntities,
  recordedEvents,
  collections,
}: {
  articleLikeEntities?: (SanitisedArticle | SanitisedBlog)[]
  recordedEvents?: SanitisedRecordedEvent[]
  collections?: SanitisedCollection[]
}) {
  const articleAndBlogImageIds = articleLikeEntities
    ? articleLikeEntities.flatMap((articleLikeEntity) =>
        getArticleLikeDocumentImageIds(articleLikeEntity.translations)
      )
    : []

  const recordedEventImageIds = recordedEvents
    ? recordedEvents.flatMap((recordedEvent) =>
        recordedEvent.summaryImage.imageId
          ? [recordedEvent.summaryImage.imageId]
          : []
      )
    : []

  const collectionImageIds = collections
    ? collections.flatMap((collection) => getAllCollectionImageIds(collection))
    : []

  const unique = removeArrDuplicates([
    ...articleAndBlogImageIds,
    ...recordedEventImageIds,
    ...collectionImageIds,
  ])

  return unique
}
