import { processArticleLikeEntityForOwnPage } from "^helpers/process-fetched-data/article-like"
import {
  Author,
  Language,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
} from "^types/entities"

export type StaticData = {
  entity: ReturnType<typeof processArticleLikeEntityForOwnPage> & {
    subjects: SanitisedSubject[]
    languages: Language[]
    authors: Author[]
    collections: SanitisedCollection[]
    tags: Tag[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}
