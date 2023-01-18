import { fetchAndValidateAuthors } from "./authors"
import { fetchAndValidateLanguages } from "./languages"
import { fetchAndValidateSubjects } from "./subjects"

export async function fetchAndValidateGlobalData() {
  const validLanguages = await fetchAndValidateLanguages("all")
  const subjects = await fetchAndValidateSubjects({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })
  const authors = await fetchAndValidateAuthors({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })

  return {
    subjects,
    languages: validLanguages,
    isMultipleAuthors: authors.entities.length > 1,
  }
}
