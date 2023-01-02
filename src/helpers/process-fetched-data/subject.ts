import produce from "immer"
import {
  SanitisedArticle,
  SanitisedBlog,
  SanitisedCollection,
  SanitisedRecordedEvent,
  SanitisedSubject,
  SubjectTranslation,
} from "^types/entities"
import { MakeRequired, MyOmit } from "^types/utilities"

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

type ProcessedTranslation = MakeRequired<
  SanitisedSubject["translations"][number],
  "title"
>

// type a = SanitisedSubject['']

export function processSubjectForOwnPage({
  subject,
  validLanguageIds,
  validChildren,
}: {
  subject: SanitisedSubject
  validLanguageIds: string[]
  validChildren: {
    articles: SanitisedArticle[]
    blogs: SanitisedBlog[]
    collections: SanitisedCollection[]
    recordedEvents: SanitisedRecordedEvent[]
  }
}) {
  // remove invalid translations; remove empty translation sections.
  const processedTranslations = produce(subject.translations, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const translation = draft[i]

      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        // const translationIndex = draft.findIndex((t) => t.id === translation.id)
        draft.splice(i, 1)
        break
      }
    }
  }) as ProcessedTranslation[]

  return processed
}
