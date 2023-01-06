import { removeArrDuplicates } from "./general"

export function getEntitiesUniqueLanguageIds<
  TEntity extends { translations: TTranslation[] },
  TTranslation extends { languageId: string }
>(entities: TEntity[]) {
  const languages = entities.flatMap((entity) =>
    entity.translations.flatMap((translation) => translation.languageId)
  )
  const unique = removeArrDuplicates(languages)

  return unique
}
