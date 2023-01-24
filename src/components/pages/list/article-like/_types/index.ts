import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { Language, SanitisedSubject } from "^types/entities"

export type StaticData = {
  articles: { entities: ArticleLikeEntityAsSummary[]; languages: Language[] }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}
