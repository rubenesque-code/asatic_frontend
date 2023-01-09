import { removeArrDuplicates } from "^helpers/general"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
} from "^types/entities"
import { getArticleLikeDocumentImageIds } from "../article-like"

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
