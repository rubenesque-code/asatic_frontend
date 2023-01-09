import { UserSection } from "^types/entities"

type UserComponent = UserSection["components"][number]

export function validateUserComponent(
  component: UserComponent,
  {
    validDocumentEntityIds,
  }: {
    validDocumentEntityIds: string[]
  }
) {
  if (!validDocumentEntityIds.includes(component.entity.id)) {
    return false
  }
  return true
}

export function validateUserSection(
  section: UserSection,
  {
    validDocumentEntityIds,
  }: {
    validDocumentEntityIds: {
      articles: string[]
      blogs: string[]
      recordedEvents: string[]
    }
  }
) {
  if (!section.components.length) {
    return false
  }

  const validComponents = section.components.filter((component) =>
    validateUserComponent(component, {
      validDocumentEntityIds:
        component.entity.type === "article"
          ? validDocumentEntityIds.articles
          : component.entity.type === "blog"
          ? validDocumentEntityIds.blogs
          : validDocumentEntityIds.recordedEvents,
    })
  )

  if (!validComponents.length) {
    return false
  }

  return true
}
