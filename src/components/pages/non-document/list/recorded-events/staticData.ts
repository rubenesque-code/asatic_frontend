import { GetStaticProps } from "next"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import {
  getRecordedEventsUniqueImageIds,
  getRecordedEventTypeIds,
} from "^helpers/process-fetched-data/recorded-event/query"
import { getEntitiesUniqueLanguageIds } from "^helpers/queryEntity"
import { fetchImages } from "^lib/firebase/firestore"
import { Language, SanitisedSubject } from "^types/entities"

export type StaticData = {
  recordedEvents: {
    recordedEvents: ReturnType<typeof processRecordedEventAsSummary>[]
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: "all",
    validLanguageIds: globalData.languages.ids,
  })

  const childIds = {
    ...getUniqueChildEntitiesIds(validRecordedEvents.entities, ["authorsIds"]),
    recordedEventTypeIds: getRecordedEventTypeIds(validRecordedEvents.entities),
  }

  const validAuthors = await fetchAndValidateAuthors({
    ids: childIds.authorsIds,
    validLanguageIds: globalData.languages.ids,
  })
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: childIds.recordedEventTypeIds,
    validLanguageIds: globalData.languages.ids,
  })

  const imageIds = getRecordedEventsUniqueImageIds(validRecordedEvents.entities)
  const fetchedImages = await fetchImages(imageIds)

  const processedRecordedEvents = validRecordedEvents.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds: globalData.languages.ids,
        validRecordedEventTypes: validRecordedEventTypes.entities,
      })
  )

  const languageIds = getEntitiesUniqueLanguageIds(processedRecordedEvents)

  return {
    props: {
      recordedEvents: {
        recordedEvents: processedRecordedEvents,
        languages: filterAndMapEntitiesById(
          languageIds,
          globalData.languages.entities
        ),
      },
      header: {
        subjects: globalData.subjects.entities,
      },
    },
  }
}
