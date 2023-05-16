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
  const componentsProcessed = components
    .sort((a, b) => a.index - b.index)
    .map((component) => {
      const { entity: componentEntity, ...restComponent } = component

      const entity = findEntityById(
        validChildEntities.articleLikeEntities,
        componentEntity.id
      )!

      return {
        ...restComponent,
        entity,
      }
    })

  return componentsProcessed
}
