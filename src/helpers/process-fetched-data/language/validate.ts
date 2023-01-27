import { Language } from "^types/entities"

export function validateLanguage(language: Language) {
  if (!language.name?.length) {
    return false
  }
  return true
}

export function filterValidLanguages(languages: Language[]) {
  const validLanguages = languages.filter((language) =>
    validateLanguage(language)
  )

  return validLanguages
}
