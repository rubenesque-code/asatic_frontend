import { filterArr1ByArr2 } from "^helpers/data"

import { Author, AuthorTranslation } from "^types/entities"
import { MakeRequired } from "^types/utilities"

export type ValidTranslation = MakeRequired<
  Author["translations"][number],
  "name"
>

export const validateTranslation = (
  translation: AuthorTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId)
  const isName = translation.name?.length

  return Boolean(languageIsValid && isName)
}

export function validateAuthorAsChild(
  author: Author,
  validLanguageIds: string[]
) {
  const validTranslation = author.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}

export function filterValidAuthorsAsChildren(
  authors: Author[],
  validLanguageIds: string[]
) {
  return authors.filter(async (author) =>
    validateAuthorAsChild(author, validLanguageIds)
  )
}

export function validateAuthorAsParent(
  author: Author,
  {
    validDocumentEntityIds,
    validLanguageIds,
  }: {
    validLanguageIds: string[]
    validDocumentEntityIds: {
      articles: string[]
      blogs: string[]
      recordedEvents: string[]
    }
  }
) {
  const validTranslation = author.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  const validChildArticles = filterArr1ByArr2(
    author.articlesIds,
    validDocumentEntityIds.articles
  )
  const validChildBlogs = filterArr1ByArr2(
    author.blogsIds,
    validDocumentEntityIds.blogs
  )
  const validChildRecordedEvents = filterArr1ByArr2(
    author.recordedEventsIds,
    validDocumentEntityIds.recordedEvents
  )

  const isPopulated =
    validChildArticles.length ||
    validChildBlogs.length ||
    validChildRecordedEvents.length

  if (!isPopulated) {
    return false
  }

  return true
}

export function filterValidAuthorsAsParents(
  authors: Author[],
  {
    validDocumentEntityIds,
    validLanguageIds,
  }: {
    validLanguageIds: string[]
    validDocumentEntityIds: {
      articles: string[]
      blogs: string[]
      recordedEvents: string[]
    }
  }
) {
  return authors.filter((author) =>
    validateAuthorAsParent(author, { validLanguageIds, validDocumentEntityIds })
  )
}
