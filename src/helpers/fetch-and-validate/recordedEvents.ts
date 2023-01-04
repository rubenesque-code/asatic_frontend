import { fetchRecordedEvents } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidRecordedEvents } from "^helpers/process-fetched-data/recorded-event/validate"

export async function fetchAndValidateRecordedEvents({
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedRecordedEvents = await fetchRecordedEvents(ids)

  if (!fetchedRecordedEvents.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages()).ids

  const validRecordedEvents = filterValidRecordedEvents(
    fetchedRecordedEvents,
    validLanguageIds
  )

  return {
    entities: validRecordedEvents,
    ids: mapIds(validRecordedEvents),
  }
}
