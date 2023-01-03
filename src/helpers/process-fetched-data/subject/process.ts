import produce from "immer"
import { pipe } from "ramda"

import {
  Author,
  Image,
  RecordedEventType,
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
  SanitisedSubject,
} from "^types/entities"
import { MakeRequired } from "^types/utilities"
import { validateTranslation } from "./validate"
import {
  ArticleLikeEntityAsSummary,
  processArticleLikeEntityAsSummary,
} from "../article-like"
import {
  processRecordedEventAsSummary,
  RecordedEventAsSummary,
} from "../recorded-event/process"
import { sortEntitiesByDate, unshiftFirstEntityWithImage } from "../_helpers"
import { DocumentEntitiesAsSummaries } from "../_types"

type ProcessedTranslation = MakeRequired<
  SanitisedSubject["translations"][number],
  "title"
>

/** Invoked after validation so has required fields. */
export function processSubjectForOwnPage({
  subject,
  validLanguageIds,
  validImages,
  validChildren,
  validAuthors,
  validRecordedEventTypes,
}: {
  subject: SanitisedSubject
  validLanguageIds: string[]
  validImages: Image[]
  validAuthors: Author[]
  validRecordedEventTypes: RecordedEventType[]
  validChildren: {
    articles: SanitisedArticle[]
    blogs: SanitisedBlog[]
    recordedEvents: SanitisedRecordedEvent[]
  }
}) {
  // remove invalid translations; remove empty translation sections.
  const processedTranslations = produce(subject.translations, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const translation = draft[i]

      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        draft.splice(i, 1)
        break
      }
    }
  }) as ProcessedTranslation[]

  // □ could be cleaned up
  const childDocumentEntities = [
    ...validChildren.articles.map((article) =>
      processArticleLikeEntityAsSummary({
        entity: article,
        validImages,
        validLanguageIds,
        validAuthors,
      })
    ),
    ...validChildren.blogs.map((blog) =>
      processArticleLikeEntityAsSummary({
        entity: blog,
        validImages,
        validLanguageIds,
        validAuthors,
      })
    ),
    ...validChildren.recordedEvents.map((recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validAuthors,
        validImages,
        validLanguageIds,
        validRecordedEventTypes,
      })
    ),
  ]

  const orderedChildDocumentEntities = orderChildDocumentEntities(
    childDocumentEntities
  )

  return {
    id: subject.id,
    publishDate: subject.publishDate,
    translations: processedTranslations,
    childDocumentEntities: orderedChildDocumentEntities,
  }
}

function splitChildEntitiesIntoSections(entities: DocumentEntitiesAsSummaries) {
  return {
    first: entities.slice(0, 5),
    second: entities.slice(5, entities.length),
  }
}

export function orderChildDocumentEntities(
  entities: (ArticleLikeEntityAsSummary | RecordedEventAsSummary)[]
) {
  const order = pipe(
    sortEntitiesByDate,
    unshiftFirstEntityWithImage,
    splitChildEntitiesIntoSections
  )

  return order(entities)
}
