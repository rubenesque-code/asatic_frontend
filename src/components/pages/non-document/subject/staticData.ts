import { GetStaticPaths, GetStaticProps } from "next"

import {
  Author,
  Language,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { processRecordedEventForOwnPage } from "^helpers/process-fetched-data/recordedEvent"
import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchChildren } from "^helpers/fetch-data"
import { validateChildren } from "^helpers/process-fetched-data/validate-wrapper"
import { mapEntityLanguageIds } from "^helpers/process-fetched-data/general"

export const getStaticPaths: GetStaticPaths = async () => {
  const validSubjects = await fetchAndValidateSubjects()

  if (!validSubjects.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validSubjects.ids.map((id) => ({
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

  // - Page specific data: START ---

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const subject = globalData.subjects.entities.find(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (subject) => subject.id === params!.id
  )!

  const fetchedChildren = await fetchChildren(subject)

  // need to fetch images of articles, blogs, etc.

  const validatedChildren = {
    ...validateChildren(fetchedChildren, globalData.languages.ids),
    languages: filterAndMapEntitiesById(
      mapEntityLanguageIds(subject),
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
