import { Language } from "^types/entities"

export function validateLanguage(language: Language) {
  if (!language.name?.length) {
    return false
  }
  return true
}
