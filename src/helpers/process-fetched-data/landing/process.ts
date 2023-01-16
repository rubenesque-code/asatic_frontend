/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { findEntityById } from "^helpers/data"
import { LandingCustomSectionComponent } from "^types/entities"
import { ArticleLikeEntityAsSummary } from "../article-like"

export function processCustomSection(
  components: LandingCustomSectionComponent[],
  {
    validChildEntities,
  }: {
    validChildEntities: {
      articleLikeEntities: ArticleLikeEntityAsSummary[]
    }
  }
) {
  const componentsPopulated = components.map((component) =>
    component.entity.type === "article"
      ? findEntityById(
          validChildEntities.articleLikeEntities,
          component.entity.id
        )!
      : findEntityById(
          validChildEntities.articleLikeEntities,
          component.entity.id
        )!
  )

  return componentsPopulated
}
