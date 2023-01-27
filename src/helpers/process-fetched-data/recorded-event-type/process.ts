import { sanitize } from "isomorphic-dompurify"

import { RecordedEventType } from "^types/entities"
import { validateTranslation } from "./validate"

/**Used within getStaticProps after validation has occurred in getStaticPaths; remove invalid translations and child entities.*/

export function processRecordedEventTypeAsChild(
  recordedEventType: RecordedEventType,
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  const translationsProcessed = recordedEventType.translations
    .filter((translation) => validateTranslation(translation, validLanguageIds))
    .map((translation) => {
      const { name, ...restOfTranslation } = translation

      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: sanitize(name!),
        ...restOfTranslation,
      }
    })

  return {
    id: recordedEventType.id,
    translations: translationsProcessed,
  }
}

export function processRecordedEventTypesAsChildren(
  recordedEventTypes: RecordedEventType[],
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  return recordedEventTypes.map((recordedEventType) =>
    processRecordedEventTypeAsChild(recordedEventType, { validLanguageIds })
  )
}
