import DOMPurify from "isomorphic-dompurify"
import { pipe } from "ramda"

import { SanitisedSubject } from "^types/entities"
import { ArticleLikeEntityAsSummary } from "../article-like"
import { sortEntitiesByDate, unshiftFirstEntityWithImage } from "../_helpers"
import { DocumentEntitiesAsSummaries } from "../_types"

/** Invoked after validation so has required fields. */
export function processSubjectForOwnPage(
  subject: SanitisedSubject,
  {
    processedChildDocumentEntities,
  }: {
    processedChildDocumentEntities: {
      articles: ArticleLikeEntityAsSummary[]
      blogs: ArticleLikeEntityAsSummary[]
    }
  }
) {
  const orderedChildDocumentEntities = processCustomSections(
    Object.values(processedChildDocumentEntities).flat()
  )

  return {
    id: subject.id,
    publishDate: subject.publishDate,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    title: DOMPurify.sanitize(subject.title!),
    customSections: orderedChildDocumentEntities,
    languageId: subject.languageId,
  }
}

function splitChildEntitiesIntoSections(entities: DocumentEntitiesAsSummaries) {
  return {
    first: entities.slice(0, 5),
    second: entities.slice(5, entities.length),
  }
}

function processCustomSections(entities: ArticleLikeEntityAsSummary[]) {
  const order = pipe(
    sortEntitiesByDate,
    unshiftFirstEntityWithImage,
    splitChildEntitiesIntoSections
  )

  return order(entities)
}

function processSubjectAsLink(subject: SanitisedSubject) {
  return {
    id: subject.id,
    publishDate: subject.publishDate,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    title: DOMPurify.sanitize(subject.title!),
    languageId: subject.languageId,
  }
}

export function processSubjectsAsLinks(subjects: SanitisedSubject[]) {
  return subjects.map((subject) => processSubjectAsLink(subject))
}
