import { GetStaticProps } from "next"

import { fetchImages } from "^lib/firebase/firestore"

import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"

import { mapLanguageIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"
import {
  processRecordedEventAsSummary,
  RecordedEventAsSummary,
} from "^helpers/process-fetched-data/recorded-event/process"
import { Language, SanitisedSubject } from "^types/entities"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { getRecordedEventTypeIds } from "^helpers/process-fetched-data/recorded-event/query"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"

export type StaticData = {
  recordedEvents: {
    entities: RecordedEventAsSummary[]
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const processedRecordedEvents = await handleProcessRecordedEvents({
    validLanguages: globalData.languages,
  })

  return {
    props: {
      recordedEvents: processedRecordedEvents,
      header: {
        subjects: globalData.subjects.entities,
      },
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}

async function handleProcessRecordedEvents({
  validLanguages,
}: {
  validLanguages: Awaited<
    ReturnType<typeof fetchAndValidateGlobalData>
  >["languages"]
}) {
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })

  const recordedEventTypeIds = getRecordedEventTypeIds(
    validRecordedEvents.entities
  )
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: recordedEventTypeIds,
    validLanguageIds: validLanguages.ids,
  })

  const authorIds = getUniqueChildEntitiesIds(validRecordedEvents.entities, [
    "authorsIds",
  ]).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: validLanguages.ids,
  })

  const imageIds = getUniqueChildEntitiesImageIds({
    recordedEvents: validRecordedEvents.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedArticles = validRecordedEvents.entities.map((recordedEvent) =>
    processRecordedEventAsSummary({
      recordedEvent,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: validLanguages.ids,
      validRecordedEventTypes: validRecordedEventTypes.entities,
    })
  )

  const articleLanguageIds = removeArrDuplicates(
    mapLanguageIds(processedArticles.flatMap((article) => article.translations))
  )
  const articleLanguages = articleLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    entities: processedArticles,
    languages: articleLanguages,
  }
}
