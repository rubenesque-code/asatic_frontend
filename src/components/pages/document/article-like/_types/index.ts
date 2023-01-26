import { processArticleLikeEntityForOwnPage } from "^helpers/process-fetched-data/article-like"
import { Author, Language } from "^types/entities"
import { StaticDataWrapper } from "^types/staticData"

type PageData = {
  articleLikeEntity: ReturnType<typeof processArticleLikeEntityForOwnPage>
  languages: Language[]
  authors: Author[]
}

export type StaticData = StaticDataWrapper<PageData>
