import { fetchAuthors } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidAuthorsAsChildren } from "^helpers/process-fetched-data/author"

// TODO: AUTHOR as parent logic
export async function fetchAndValidateAuthors({
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetched = await fetchAuthors(ids)

  if (!fetched.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages()).ids

  const validAuthors = filterValidAuthorsAsChildren(fetched, validLanguageIds)

  return {
    entities: validAuthors,
    ids: mapIds(validAuthors),
  }
}
