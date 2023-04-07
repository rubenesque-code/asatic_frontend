import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { Language } from "^types/entities"

export type PageData = {
  articleLikeEntities: ArticleLikeEntityAsSummary[]
  languages: Language[]
}
