import { filterArr1ByArr2 } from "^helpers/data"
import { SanitisedSubject } from "^types/entities"

/** requires: valid language id and title. */
const validateSubject = (
  subject: SanitisedSubject,
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) => {
  if (!validLanguageIds.includes(subject.languageId)) {
    return false
  }

  const hasTitle = subject.title?.length

  if (!hasTitle) {
    return false
  }

  return true
}

export function validateSubjectAsChild(
  subject: SanitisedSubject,
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  return validateSubject(subject, { validLanguageIds })
}

export function validateSubjectAsParent(
  subject: SanitisedSubject,
  {
    validDocumentEntityIds,
    validLanguageIds,
  }: {
    validLanguageIds: string[]
    validDocumentEntityIds: {
      articles: string[]
      blogs: string[]
      collections: string[]
      recordedEvents: string[]
    }
  }
) {
  const isSelfValid = validateSubject(subject, { validLanguageIds })

  if (!isSelfValid) {
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
    validDocumentEntityIds,
    validLanguageIds,
  }: {
    validLanguageIds: string[]
    validDocumentEntityIds: {
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
      ? validateSubjectAsParent(subject, {
          validLanguageIds,
          validDocumentEntityIds,
        })
      : validateSubjectAsChild(subject, { validLanguageIds })
  )
}
