import { GetStaticPaths, GetStaticProps } from "next"

import {
  fetchRecordedEvent,
  fetchRecordedEvents,
} from "^lib/firebase/firestore"

import {
  Author,
  Language,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateLanguages } from "^helpers/fetch-and-validate/languages"
import { filterValidRecordedEvents } from "^helpers/process-fetched-data/recorded-event/validate"
import { processRecordedEventForOwnPage } from "^helpers/process-fetched-data/recorded-event/process"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchChildEntities } from "^helpers/fetch-data"
import { validateChildren } from "^helpers/process-fetched-data/validate-wrapper"
import {
  mapEntitiesLanguageIds,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data/general"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedRecordedEvents = await fetchRecordedEvents()

  if (!fetchedRecordedEvents.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const languages = await fetchAndValidateLanguages(
    mapEntitiesLanguageIds(fetchedRecordedEvents)
  )

  const validRecordedEvents = filterValidRecordedEvents(
    fetchedRecordedEvents,
    languages.ids
  )

  if (!validRecordedEvents.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validRecordedEvents.map((recordedEvent) => ({
    params: {
      id: recordedEvent.id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export type StaticData = {
  recordedEvent: ReturnType<typeof processRecordedEventForOwnPage> & {
    subjects: SanitisedSubject[]
    languages: Language[]
    authors: Author[]
    collections: SanitisedCollection[]
    tags: Tag[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}
export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // - Page specific data: START ---

  const fetchedRecordedEvent = await fetchRecordedEvent(params?.id || "")

  const fetchedChildren = await fetchChildEntities(fetchedRecordedEvent)

  // ! validateChildren → recordedEventType typing works? It catches undefinde, null, invalid?
  const validatedChildren = {
    ...validateChildren(
      {
        authors: fetchedChildren.authors,
        collections: fetchedChildren.collections,
        tags: fetchedChildren.tags,
        recordedEventType: fetchedChildren.recordedEventType,
      },
      globalData.languages.ids
    ),
    subjects: filterAndMapEntitiesById(
      fetchedRecordedEvent.subjectsIds,
      globalData.subjects.entities
    ),
    languages: filterAndMapEntitiesById(
      mapEntityLanguageIds(fetchedRecordedEvent),
      globalData.languages.entities
    ),
  }

  const processedRecordedEvent = processRecordedEventForOwnPage({
    recordedEvent: fetchedRecordedEvent,
    recordedEventType: validatedChildren.recordedEventType,
    validLanguageIds: globalData.languages.ids,
  })

  const pageData: StaticData = {
    recordedEvent: { ...processedRecordedEvent, ...validatedChildren },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
