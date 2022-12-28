import { filterArrAgainstControl } from "^helpers/general"
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
  validRelatedEntities: {
    languageIds: string[]
    articleIds: string[]
    blogIds: string[]
    collectionIds: string[]
    recordedEventIds: string[]
  }
) {
  const validTranslation = subject.translations.find((translation) =>
    validateTranslation(translation, validRelatedEntities.languageIds)
  )

  if (!validTranslation) {
    return false
  }

  const subjectValidArticleIds = filterArrAgainstControl(
    subject.articlesIds,
    validRelatedEntities.articleIds
  )
  const subjectValidBlogIds = filterArrAgainstControl(
    subject.blogsIds,
    validRelatedEntities.blogIds
  )
  const subjectValidRecordedEventIds = filterArrAgainstControl(
    subject.recordedEventsIds,
    validRelatedEntities.recordedEventIds
  )
  const subjectValidCollectionIds = filterArrAgainstControl(
    subject.collectionsIds,
    validRelatedEntities.collectionIds
  )

  const hasRelatedEntity =
    subjectValidArticleIds.length ||
    subjectValidBlogIds.length ||
    subjectValidRecordedEventIds.length ||
    subjectValidCollectionIds.length

  if (!hasRelatedEntity) {
    return false
  }

  return true
}
