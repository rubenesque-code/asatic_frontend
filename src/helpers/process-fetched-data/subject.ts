import { Subject, SubjectTranslation } from "^types/entities"

const validateTranslation = (
  translation: SubjectTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId)
  const isTitle = translation.title?.length

  return Boolean(languageIsValid && isTitle)
}

export function validateSubjectAsChild(
  subject: Subject,
  validLanguageIds: string[]
) {
  if (subject.publishStatus !== "published") {
    return false
  }

  const validTranslation = subject.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}
