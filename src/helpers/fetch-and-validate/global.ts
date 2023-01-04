import { fetchAndValidateLanguages } from "./languages"
import { fetchAndValidateSubjects } from "./subjects"

export async function fetchAndValidateGlobalData() {
  const validLanguages = await fetchAndValidateLanguages("all")
  const subjects = await fetchAndValidateSubjects({
    subjectIds: "all",
    validLanguageIds: validLanguages.ids,
  })

  return {
    subjects,
    languages: validLanguages,
  }
}
