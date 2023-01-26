import { GetStaticPaths, GetStaticProps } from "next"

import { fetchRecordedEvent } from "^lib/firebase/firestore"

import { Author, Language } from "^types/entities"

import { mapLanguageIds } from "^helpers/data"
import { processRecordedEventForOwnPage } from "^helpers/process-fetched-data/recorded-event/process"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { StaticDataWrapper } from "^types/staticData"

export const getStaticPaths: GetStaticPaths = async () => {
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: "all",
  })

  if (!validRecordedEvents.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validRecordedEvents.ids.map((id) => ({
    params: {
      id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

type PageData = {
  recordedEvent: ReturnType<typeof processRecordedEventForOwnPage>
  languages: Language[]
  authors: Author[]
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fetchedRecordedEvent = await fetchRecordedEvent(params!.id)

  const validAuthors = fetchedRecordedEvent.authorsIds.map(
    (authorId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allAuthors.entities.find(
        (author) => author.id === authorId
      )!
  )

  const validRecordedEventType = !fetchedRecordedEvent.recordedEventTypeId
    ? null
    : (
        await fetchAndValidateRecordedEventTypes({
          ids: [fetchedRecordedEvent.recordedEventTypeId],
          validLanguageIds: globalData.validatedData.allLanguages.ids,
        })
      ).entities[0]

  const processedRecordedEvent = processRecordedEventForOwnPage({
    recordedEvent: fetchedRecordedEvent,
    recordedEventType: validRecordedEventType,
    validLanguageIds: globalData.validatedData.allLanguages.ids,
  })

  const recordedEventLanguageIds = mapLanguageIds(
    processedRecordedEvent.translations
  )
  const recordedEventLanguages = recordedEventLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  const pageData: StaticData = {
    globalData: globalData.globalContextData,
    pageData: {
      recordedEvent: processedRecordedEvent,
      authors: validAuthors,
      languages: recordedEventLanguages,
    },
  }

  return {
    props: pageData,
  }
}
