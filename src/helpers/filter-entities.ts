import { mapLanguageIds } from "./data"

function checkEntityHasTranslationWithLanguage<
  TEntity extends { translations: TTranslation[] },
  TTranslation extends { languageId: string }
>(entity: TEntity, languageId: string) {
  return mapLanguageIds(entity.translations).includes(languageId)
}

export function filterEntitiesWithLanguage<
  TEntity extends { translations: TTranslation[] },
  TTranslation extends { languageId: string }
>(entities: TEntity[], languageId: string) {
  return entities.filter((entity) =>
    checkEntityHasTranslationWithLanguage(entity, languageId)
  )
}
