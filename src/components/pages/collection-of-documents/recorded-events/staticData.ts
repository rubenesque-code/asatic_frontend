import { GetStaticProps } from "next"

import { fetchImages } from "^lib/firebase/firestore"

import {
  fetchAndValidateGlobalData,
  GlobalDataValidated,
} from "^helpers/fetch-and-validate/global"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"

import { mapIds } from "^helpers/data"
import {
  processRecordedEventAsSummary,
  RecordedEventAsSummary,
} from "^helpers/process-fetched-data/recorded-event/process"
import { Language } from "^types/entities"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { StaticDataWrapper } from "^types/staticData"
import { handleProcessRecordedEventTypesAsChildren } from "^helpers/process-fetched-data/recorded-event-type/compose"
import { handleProcessAuthorsAsChildren } from "^helpers/process-fetched-data/author/compose"
import { getEntitiesUniqueLanguagesAndProcess } from "^helpers/process-fetched-data/language/compose"

type PageData = {
  recordedEvents: RecordedEventAsSummary[]
  languages: Language[]
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const processedRecordedEvents = await handleProcessRecordedEvents({
    globalData: globalData.validatedData,
  })

  return {
    props: {
      globalData: {
        ...globalData.globalContextData,
        documentLanguageIds: mapIds(processedRecordedEvents.languages),
      },
      pageData: {
        languages: processedRecordedEvents.languages,
        recordedEvents: processedRecordedEvents.entities,
      },
    },
  }
}

async function handleProcessRecordedEvents({
  globalData,
}: {
  globalData: GlobalDataValidated
}) {
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: "all",
    validLanguageIds: globalData.allLanguages.ids,
  })

  const processedRecordedEventTypes =
    await handleProcessRecordedEventTypesAsChildren(
      validRecordedEvents.entities,
      {
        validLanguageIds: globalData.allLanguages.ids,
      }
    )

  const processedAuthors = await handleProcessAuthorsAsChildren(
    validRecordedEvents.entities,
    {
      validLanguageIds: globalData.allLanguages.ids,
      allValidAuthors: globalData.allAuthors.entities,
    }
  )

  const imageIds = getUniqueChildEntitiesImageIds({
    recordedEvents: validRecordedEvents.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedRecordedEvents = validRecordedEvents.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary(recordedEvent, {
        processedAuthors,
        processedRecordedEventTypes,
        validImages: fetchedImages,
        validLanguageIds: globalData.allLanguages.ids,
      })
  )

  const recordedEventLanguages = getEntitiesUniqueLanguagesAndProcess(
    processedRecordedEvents,
    globalData.allLanguages.entities
  )

  return {
    entities: processedRecordedEvents,
    languages: recordedEventLanguages,
  }
}
