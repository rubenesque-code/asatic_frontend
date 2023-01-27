import { mapLanguageIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"

export function getEntitiesUniqueLanguageIds<
  TEntity extends { translations: TTranslation[] },
  TTranslation extends { languageId: string }
>(entities: TEntity[]) {
  return removeArrDuplicates(
    mapLanguageIds(entities.flatMap((entity) => entity.translations))
  )
}
