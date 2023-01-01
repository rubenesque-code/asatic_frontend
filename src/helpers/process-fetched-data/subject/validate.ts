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

export function validateSubject(
  subject: SanitisedSubject,
  validLanguageIds: string[],
  validChildEntityIds: {
    articles: string[]
    blogs: string[]
    collections: string[]
    recordedEvents: string[]
  }
) {
  const validTranslation = subject.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  const isPopulated = Object.values(validChildEntityIds).flatMap(
    (arr) => arr
  ).length

  if (!isPopulated) {
    return false
  }

  return true
}

export function filterValidSubjects(
  subjects: SanitisedSubject[],
  validLanguageIds: string[],
  validChildEntityIds: {
    articles: string[]
    blogs: string[]
    collections: string[]
    recordedEvents: string[]
  }
) {
  return subjects.filter((subject) =>
    validateSubject(subject, validLanguageIds, validChildEntityIds)
  )
}
