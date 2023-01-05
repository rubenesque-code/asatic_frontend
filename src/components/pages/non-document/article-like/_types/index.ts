import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { SanitisedSubject } from "^types/entities"

type ArticleLikeAsSummary = ReturnType<typeof processArticleLikeEntityAsSummary>

export type StaticData = {
  articleLikeEntities: ArticleLikeAsSummary[]
  header: {
    subjects: SanitisedSubject[]
  }
}
