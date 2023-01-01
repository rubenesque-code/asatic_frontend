import { fetchAndValidateLanguages } from "./languages"
import { fetchAndValidateSubjects } from "./subjects"

export async function fetchAndValidateGlobalData() {
  const subjects = await fetchAndValidateSubjects()
  const languages = await fetchAndValidateLanguages()

  return {
    subjects,
    languages,
  }
}
