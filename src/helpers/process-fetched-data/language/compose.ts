import { fetchLanguages } from "^lib/firebase/firestore"
import { Language } from "^types/entities"
import { processLanguages } from "./process"
import { getEntitiesUniqueLanguageIds } from "./query"
import { filterValidLanguages } from "./validate"

export async function fetchValidateProcessLanguages() {
  const languages = await fetchLanguages("all")
  const valid = filterValidLanguages(languages)
  const processed = processLanguages(valid)

  return processed
}

export function getEntitiesUniqueLanguagesAndProcess<
  TEntity extends { translations: TTranslation[] },
  TTranslation extends { languageId: string }
>(entities: TEntity[], validLanguages: Language[]) {
  const languageIds = getEntitiesUniqueLanguageIds(entities)

  // · entities already validated for valid language so any of languageIds will have a corresponding language entity
  const languages = languageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validLanguages.find((validLanguage) => validLanguage.id === languageId)!
  )
  const processed = processLanguages(languages)

  return processed
}
