import { mapIds } from "^helpers/data"
import { filterValidLanguages } from "^helpers/process-fetched-data"
import { fetchLanguages } from "^lib/firebase/firestore"

export async function fetchAndValidateLanguages(ids?: string[]) {
  const languages = await fetchLanguages(ids)
  const valid = filterValidLanguages(languages)

  return {
    entities: valid,
    ids: mapIds(valid),
  }
}
