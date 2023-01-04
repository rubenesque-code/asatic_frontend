import { pipe } from "ramda"

import { SanitisedSubject } from "^types/entities"
import { MakeRequired } from "^types/utilities"
import { validateTranslation } from "./validate"
import { ArticleLikeEntityAsSummary } from "../article-like"
import { RecordedEventAsSummary } from "../recorded-event/process"
import { sortEntitiesByDate, unshiftFirstEntityWithImage } from "../_helpers"
import { DocumentEntitiesAsSummaries } from "../_types"

type ValidTranslation = MakeRequired<
  SanitisedSubject["translations"][number],
  "title"
>

/** Invoked after validation so has required fields. */
export function processSubjectForOwnPage(
  subject: SanitisedSubject,
  {
    validLanguageIds,
    processedChildDocumentEntities,
  }: {
    validLanguageIds: string[]
    processedChildDocumentEntities: {
      articles: ArticleLikeEntityAsSummary[]
      blogs: ArticleLikeEntityAsSummary[]
      recordedEvents: RecordedEventAsSummary[]
    }
  }
) {
  const validTranslations = subject.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as ValidTranslation[]

  const orderedChildDocumentEntities = orderChildDocumentEntities(
    Object.values(processedChildDocumentEntities).flat()
  )

  return {
    id: subject.id,
    publishDate: subject.publishDate,
    translations: validTranslations,
    childDocumentEntities: orderedChildDocumentEntities,
  }
}

function splitChildEntitiesIntoSections(entities: DocumentEntitiesAsSummaries) {
  return {
    first: entities.slice(0, 5),
    second: entities.slice(5, entities.length),
  }
}

function orderChildDocumentEntities(
  entities: (ArticleLikeEntityAsSummary | RecordedEventAsSummary)[]
) {
  const order = pipe(
    sortEntitiesByDate,
    unshiftFirstEntityWithImage,
    splitChildEntitiesIntoSections
  )

  return order(entities)
}
