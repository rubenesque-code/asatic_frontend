import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { Language, SanitisedSubject } from "^types/entities"

type ArticleLikeAsSummary = ReturnType<typeof processArticleLikeEntityAsSummary>

export type StaticData = {
  articleLikeEntities: {
    entities: ArticleLikeAsSummary[]
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}
