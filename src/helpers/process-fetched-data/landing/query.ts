import { removeArrDuplicates } from "^helpers/general"
import { UserSection } from "^types/entities"

export function getLandingUserSectionsUniqueChildIds(sections: UserSection[]) {
  const entities = sections.flatMap((section) =>
    section.components.flatMap((component) => component.entity)
  )

  const articleIds = entities
    .filter((entity) => entity.type === "article")
    .map((entity) => entity.id)
  const blogIds = entities
    .filter((entity) => entity.type === "blog")
    .map((entity) => entity.id)
  const recordedEventIds = entities
    .filter((entity) => entity.type === "recordedEvent")
    .map((entity) => entity.id)

  return {
    articles: removeArrDuplicates(articleIds),
    blogs: removeArrDuplicates(blogIds),
    recordedEvents: removeArrDuplicates(recordedEventIds),
  }
}
/*     (
      {
        articles,
        blogs,
        recordedEvents,
      }: { articles: string[]; blogs: string[]; recordedEvents: string[] },
      entity
    ) =>
      {},
    entities */
