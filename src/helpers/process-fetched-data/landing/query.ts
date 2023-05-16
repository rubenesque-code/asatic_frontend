import { removeArrDuplicates } from "^helpers/general"
import { LandingCustomSectionComponent } from "^types/entities"

export function getLandingUserSectionsUniqueChildIds(
  components: LandingCustomSectionComponent[]
) {
  const articleIds = components
    .filter((component) => component.entity.type === "article")
    .map((component) => component.entity.id)
  const blogIds = components
    .filter((component) => component.entity.type === "blog")
    .map((component) => component.entity.id)

  return {
    articles: removeArrDuplicates(articleIds),
    blogs: removeArrDuplicates(blogIds),
  }
}
