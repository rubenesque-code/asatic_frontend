import { filterArr1ByArr2 } from "^helpers/data"
import { SanitisedSubject, SubjectTranslation } from "^types/entities"

/** requires: valid language id and title. */
export const validateTranslation = (
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
  validDocumentEntityIds: {
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

  const validChildArticles = filterArr1ByArr2(
    subject.articlesIds,
    validDocumentEntityIds.articles
  )
  const validChildBlogs = filterArr1ByArr2(
    subject.blogsIds,
    validDocumentEntityIds.blogs
  )
  const validChildRecordedEvents = filterArr1ByArr2(
    subject.recordedEventsIds,
    validDocumentEntityIds.recordedEvents
  )
  const validChildCollections = filterArr1ByArr2(
    subject.collectionsIds,
    validDocumentEntityIds.collections
  )

  const isPopulated =
    validChildArticles.length ||
    validChildBlogs.length ||
    validChildRecordedEvents.length ||
    validChildCollections.length

  if (!isPopulated) {
    return false
  }

  return true
}

export function filterValidSubjects(
  subjects: SanitisedSubject[],
  {
    subjectRelation,
    validChildEntityIds,
    validLanguageIds,
  }: {
    validLanguageIds: string[]
    validChildEntityIds: {
      articles: string[]
      blogs: string[]
      collections: string[]
      recordedEvents: string[]
    }
    subjectRelation: "child-of-document" | "default"
  }
) {
  return subjects.filter((subject) =>
    subjectRelation === "default"
      ? validateSubject(subject, validLanguageIds, validChildEntityIds)
      : validateSubjectAsChild(subject, validLanguageIds)
  )
}
