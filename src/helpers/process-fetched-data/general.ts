import { Language } from '^types/language'

import { mapLanguageIds } from '../data'

export function validateLanguages(languages: Language[]) {
  return languages.filter((l) => l.name.length)
}

export function mapEntitiesLanguageIds<
  TTranslation extends { languageId: string },
  TEntity extends { translations: TTranslation[] }
>(entities: TEntity[]) {
  return entities.flatMap((e) => mapLanguageIds(e.translations))
}
