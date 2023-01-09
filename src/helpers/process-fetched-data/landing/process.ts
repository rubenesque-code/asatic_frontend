/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { findEntityById, mapIds } from "^helpers/data"
import { UserSection } from "^types/entities"
import { ArticleLikeEntityAsSummary } from "../article-like"
import { RecordedEventAsSummary } from "../recorded-event/process"
import { validateUserComponent } from "./validate"

function processUserSection(
  section: UserSection,
  {
    validChildEntities,
  }: {
    validChildEntities: {
      articles: ArticleLikeEntityAsSummary[]
      blogs: ArticleLikeEntityAsSummary[]
      recordedEvents: RecordedEventAsSummary[]
    }
  }
) {
  const { components, ...restOfSection } = section

  const componentsFiltered = components.filter((component) =>
    validateUserComponent(component, {
      validDocumentEntityIds:
        component.entity.type === "article"
          ? mapIds(validChildEntities.articles)
          : component.entity.type === "blog"
          ? mapIds(validChildEntities.blogs)
          : mapIds(validChildEntities.recordedEvents),
    })
  )
  const componentsPopulated = componentsFiltered.map((component) =>
    component.entity.type === "article"
      ? findEntityById(validChildEntities.articles, component.entity.id)!
      : component.entity.type === "blog"
      ? findEntityById(validChildEntities.blogs, component.entity.id)!
      : findEntityById(validChildEntities.recordedEvents, component.entity.id)!
  )

  return {
    ...restOfSection,
    components: componentsPopulated,
  }
}

export function processUserSections(
  sections: UserSection[],
  {
    validChildEntities,
  }: {
    validChildEntities: {
      articles: ArticleLikeEntityAsSummary[]
      blogs: ArticleLikeEntityAsSummary[]
      recordedEvents: RecordedEventAsSummary[]
    }
  }
) {
  return sections.map((section) =>
    processUserSection(section, { validChildEntities })
  )
}
