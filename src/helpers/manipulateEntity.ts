import produce from "immer"
import { defaultSiteLanguageId } from "^constants/languages"
import { Language } from "^types/entities"
import { findTranslationByLanguageId } from "./data"

export function reorderSections<TSection extends { index: number }>(
  sections: TSection[]
) {
  const ordered = produce(sections, (draft) => {
    draft.sort((a, b) => a.index - b.index)
  })

  return ordered
}

export function sortEntitiesByDate<TEntity extends { publishDate: string }>(
  entities: TEntity[]
) {
  return entities.sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })
}

export function sortEntitiesByLanguage<
  TEntity extends { translations: TTranslation[] },
  TTranslation extends { languageId: string }
>(entities: TEntity[], languageId: string) {
  return entities.sort((a, b) => {
    const aHasSiteLanguageTranslation = findTranslationByLanguageId(
      a.translations,
      languageId
    )
    const bHasSiteLanguageTranslation = findTranslationByLanguageId(
      b.translations,
      languageId
    )

    if (aHasSiteLanguageTranslation && bHasSiteLanguageTranslation) {
      return 0
    } else if (aHasSiteLanguageTranslation) {
      return -1
    } else if (bHasSiteLanguageTranslation) {
      return 1
    }
    return 0
  })
}

export function sortEntitiesByIndex<TEntity extends { index: number }>(
  entities: TEntity[]
) {
  return entities.sort((a, b) => {
    return b.index - a.index
  })
}

export function sortLanguages(languages: Language[]) {
  return languages.sort((a, b) => {
    const aIsDefaultLanguage = a.id === defaultSiteLanguageId
    const bIsDefaultLanguage = b.id === defaultSiteLanguageId

    if (aIsDefaultLanguage) {
      return -1
    } else if (bIsDefaultLanguage) {
      return 1
    }
    return 0
  })
}
