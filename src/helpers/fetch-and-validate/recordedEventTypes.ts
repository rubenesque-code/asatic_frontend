import { fetchRecordedEventTypes } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidRecordedEventTypesAsChildren } from "^helpers/process-fetched-data/recorded-event-type/validate"

export async function fetchAndValidateRecordedEventTypes({
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedRecordedEventTypes = await fetchRecordedEventTypes(ids)

  if (!fetchedRecordedEventTypes.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  const validRecordedEventTypes = filterValidRecordedEventTypesAsChildren(
    fetchedRecordedEventTypes,
    validLanguageIds
  )

  return {
    entities: validRecordedEventTypes,
    ids: mapIds(validRecordedEventTypes),
  }
}
