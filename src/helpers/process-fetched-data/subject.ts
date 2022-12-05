import { SanitisedSubject, SubjectTranslation } from "^types/entities"

const validateTranslation = (
  translation: SubjectTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId)
  const isTitle = translation.title?.length

  return Boolean(languageIsValid && isTitle)
}

export function validateSubjectAsChild(
  subject: SanitisedSubject,
  validLanguageIds: string[]
) {
  const validTranslation = subject.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}
