import { GetStaticPaths, GetStaticProps } from "next"

import { fetchRecordedEvent } from "^lib/firebase/firestore"

import {
  Author,
  Language,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { processRecordedEventForOwnPage } from "^helpers/process-fetched-data/recorded-event/process"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { mapEntityLanguageIds } from "^helpers/process-fetched-data/general"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateTags } from "^helpers/fetch-and-validate/tags"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"

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

  const fetchedRecordedEvent = await fetchRecordedEvent(params?.id || "")

  const validAuthors = await fetchAndValidateAuthors({
    ids: fetchedRecordedEvent.authorsIds,
    validLanguageIds: globalData.languages.ids,
  })
  const validCollections = await fetchAndValidateCollections({
    ids: fetchedRecordedEvent.collectionsIds,
    collectionRelation: "child-of-document",
    validLanguageIds: globalData.languages.ids,
  })
  const validTags = await fetchAndValidateTags({
    ids: fetchedRecordedEvent.tagsIds,
  })
  const validRecordedEventType = !fetchedRecordedEvent.recordedEventTypeId
    ? null
    : (
        await fetchAndValidateRecordedEventTypes({
          ids: [fetchedRecordedEvent.recordedEventTypeId],
          validLanguageIds: globalData.languages.ids,
        })
      ).entities[0]

  const processedRecordedEvent = processRecordedEventForOwnPage({
    recordedEvent: fetchedRecordedEvent,
    recordedEventType: validRecordedEventType,
    validLanguageIds: globalData.languages.ids,
  })

  const pageData: StaticData = {
    recordedEvent: {
      ...processedRecordedEvent,
      authors: validAuthors.entities,
      collections: validCollections.entities,
      languages: filterAndMapEntitiesById(
        mapEntityLanguageIds(processedRecordedEvent),
        globalData.languages.entities
      ),
      subjects: filterAndMapEntitiesById(
        fetchedRecordedEvent.subjectsIds,
        globalData.subjects.entities
      ),
      tags: validTags.entities,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
