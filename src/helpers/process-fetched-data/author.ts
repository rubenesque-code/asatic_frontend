import { Author, AuthorTranslation } from "^types/entities"

const validateTranslation = (
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
