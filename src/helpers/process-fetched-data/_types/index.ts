import { ArticleLikeEntityAsSummary } from "../article-like"
import { RecordedEventAsSummary } from "../recorded-event/process"

export type DocumentEntitiesAsSummaries = (
  | ArticleLikeEntityAsSummary
  | RecordedEventAsSummary
)[]
