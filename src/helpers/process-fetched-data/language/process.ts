import { sanitize } from "dompurify"
import { Language } from "^types/entities"

export function processLanguage(language: Language) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { id: language.id, name: sanitize(language.name!) }
}

export function processLanguages(languages: Language[]) {
  return languages.map(processLanguage)
}
