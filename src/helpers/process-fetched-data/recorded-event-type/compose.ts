import { SanitisedRecordedEvent } from "^types/entities"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { getRecordedEventTypeIds } from "../recorded-event/query"
import { processRecordedEventTypesAsChildren } from "./process"

export async function handleProcessRecordedEventTypesAsChildren(
  entities: SanitisedRecordedEvent[],
  { validLanguageIds }: { validLanguageIds: string[] }
) {
  const ids = getRecordedEventTypeIds(entities)

  if (!ids.length) {
    return []
  }

  const validated = (
    await fetchAndValidateRecordedEventTypes(ids, {
      validLanguageIds,
    })
  ).entities

  const processed = processRecordedEventTypesAsChildren(validated, {
    validLanguageIds,
  })

  return processed
}
