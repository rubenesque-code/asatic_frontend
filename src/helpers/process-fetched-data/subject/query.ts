import { removeArrDuplicates } from "^helpers/general"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
} from "^types/entities"
import { getArticleLikeDocumentImageIds } from "../article-like"

export function getSubjectChildImages({
  articles,
  blogs,
  recordedEvents,
}: {
  articles: SanitisedArticle[]
  blogs: SanitisedBlog[]
  recordedEvents: SanitisedRecordedEvent[]
}) {
  const articleAndBlogImages = [...articles, ...blogs].flatMap((article) =>
    getArticleLikeDocumentImageIds(article.translations)
  )
  const recordedEventImages = recordedEvents.flatMap((recordedEvent) =>
    recordedEvent.summaryImage.imageId
      ? [recordedEvent.summaryImage.imageId]
      : []
  )

  const unique = removeArrDuplicates([
    ...articleAndBlogImages,
    ...recordedEventImages,
  ])

  return unique
}
