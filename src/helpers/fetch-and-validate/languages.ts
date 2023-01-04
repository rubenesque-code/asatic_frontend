import { fetchLanguages } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { filterValidLanguages } from "^helpers/process-fetched-data/language"

export async function fetchAndValidateLanguages(ids: string[] | "all") {
  const languages = await fetchLanguages(ids)
  const valid = filterValidLanguages(languages)

  return {
    entities: valid,
    ids: mapIds(valid),
  }
}
