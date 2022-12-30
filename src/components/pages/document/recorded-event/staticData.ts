import { GetStaticPaths, GetStaticProps } from "next"

import {
  fetchArticle,
  fetchAuthors,
  fetchCollections,
  fetchLanguages,
  fetchRecordedEvent,
  fetchRecordedEvents,
  fetchRecordedEventType,
  fetchSubjects,
  fetchTags,
} from "^lib/firebase/firestore"

import {
  Author,
  Language,
  RecordedEventType,
  SanitisedCollection,
  SanitisedRecordedEvent,
  SanitisedSubject,
} from "^types/entities"

import { mapIds } from "^helpers/data"
import {
  mapEntitiesLanguageIds,
  filterValidAuthorsAsChildren,
  filterValidCollections,
  filterValidTags,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data"
import { filterArrAgainstControl } from "^helpers/general"
import {
  fetchAndValidateGlobalData,
  fetchAndValidateSubjects,
} from "^helpers/static-data/global"
import {
  filterValidRecordedEvents,
  processValidatedRecordedEvent,
} from "^helpers/process-fetched-data/recordedEvent"
import { validateRecordedEventTypeAsChild } from "^helpers/process-fetched-data/recordedEventType"
import { fetchAndValidateLanguages } from "^helpers/static-data/languages"
import { fetchChildren } from "^helpers/static-data/helpers"

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
  recordedEvent: SanitisedRecordedEvent
  childEntities: {
    authors: Author[]
    collections: SanitisedCollection[]
    languages: Language[]
    recordedEventType: RecordedEventType | undefined | null
    // subjects: SanitisedSubject[]
    // tags: Tag[]
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

  const fetchedChildren = await fetchChildren(fetchedRecordedEvent)

  const recordedEventChildrenIds = {
    languages: mapEntityLanguageIds(fetchedRecordedEvent),
    authors: fetchedRecordedEvent.authorsIds,
    collections: fetchedRecordedEvent.collectionsIds,
    subjects: fetchedRecordedEvent.subjectsIds,
    tags: fetchedRecordedEvent.tagsIds,
    recordedEventType: fetchedRecordedEvent.recordedEventTypeId,
  }

  const recordedEventChildrenFetched = {
    authors: !recordedEventChildrenIds.authors.length
      ? []
      : await fetchAuthors(recordedEventChildrenIds.authors),
    collections: !recordedEventChildrenIds.collections.length
      ? []
      : await fetchCollections(recordedEventChildrenIds.collections),
    subjects: !recordedEventChildrenIds.subjects.length
      ? []
      : await fetchSubjects(recordedEventChildrenIds.subjects),
    tags: !recordedEventChildrenIds.tags.length
      ? []
      : await fetchTags(recordedEventChildrenIds.tags),
    recordedEventType: !recordedEventChildrenIds.recordedEventType
      ? null
      : await fetchRecordedEventType(
          recordedEventChildrenIds.recordedEventType
        ),
  }

  const recordedEventChildrenValidated = {
    languages: recordedEventChildrenIds.languages
      .filter((recordedEventLanguageId) =>
        allValidLanguagesIds.includes(recordedEventLanguageId)
      )
      .map((recordedEventLanguageId) =>
        allValidLanguages.find(
          (language) => language.id === recordedEventLanguageId
        )
      )
      .flatMap((language) => (language ? [language] : [])),
    authors: filterValidAuthorsAsChildren(
      recordedEventChildrenFetched.authors,
      allValidLanguagesIds
    ),
    collections: filterValidCollections(
      recordedEventChildrenFetched.collections,
      allValidLanguagesIds
    ),
    tags: filterValidTags(recordedEventChildrenFetched.tags),
    recordedEventType: validateRecordedEventTypeAsChild(
      recordedEventChildrenFetched.recordedEventType,
      allValidLanguagesIds
    )
      ? recordedEventChildrenFetched.recordedEventType
      : null,
  }

  // should remove invalid image sections too (without corresponding fetched image)
  const processedRecordedEvent = processValidatedRecordedEvent({
    entity: fetchedRecordedEvent,
    validLanguageIds: allValidLanguagesIds,
    validRelatedEntitiesIds: {
      authorsIds: mapIds(recordedEventChildrenValidated.authors),
      collectionsIds: mapIds(recordedEventChildrenValidated.collections),
      subjectsIds: filterArrAgainstControl(
        mapIds(recordedEventChildrenFetched.subjects),
        mapIds(allValidSubjects)
      ),
      tagsIds: mapIds(recordedEventChildrenValidated.tags),
    },
    recordedEventTypeIsValid: Boolean(
      recordedEventChildrenValidated.recordedEventType
    ),
  })
  // - Page specific data: END ---

  const pageData: StaticData = {
    recordedEvent: processedRecordedEvent,
    childEntities: recordedEventChildrenValidated,
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
