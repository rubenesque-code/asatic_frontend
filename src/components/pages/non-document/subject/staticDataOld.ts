import { GetStaticPaths, GetStaticProps } from "next"

import {
  Language,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchChildEntities } from "^helpers/fetch-data"
import { validateChildren } from "^helpers/process-fetched-data/validate-wrapper"
import { mapEntityLanguageIds } from "^helpers/process-fetched-data/general"
import {
  getSubjectChildAuthorIds,
  getSubjectChildImageIds,
} from "^helpers/process-fetched-data/subject/query"
import {
  fetchAuthors,
  fetchImages,
  fetchRecordedEventTypes,
} from "^lib/firebase/firestore"
import { filterValidAuthorsAsChildren } from "^helpers/process-fetched-data/author"
import { processSubjectForOwnPage } from "^helpers/process-fetched-data/subject/process"
import { filterValidRecordedEventTypesAsChildren } from "^helpers/process-fetched-data/recorded-event-type/validate"
import { filterValidArticleLikeEntities } from "^helpers/process-fetched-data/article-like"
import { filterValidRecordedEvents } from "^helpers/process-fetched-data/recorded-event/validate"
import { filterValidTags } from "^helpers/process-fetched-data/tag"

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
  subject: ReturnType<typeof processSubjectForOwnPage> & {
    languages: Language[]
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

  const validLanguageIds = globalData.languages.ids

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const subject = globalData.subjects.entities.find(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (subject) => subject.id === params!.id
  )!

  const fetchedChildren = await fetchChildEntities(subject)

  const validatedArticles = filterValidArticleLikeEntities(
    fetchedChildren.articles,
    validLanguageIds
  )
  const validatedBlogs = filterValidArticleLikeEntities(
    fetchedChildren.blogs,
    validLanguageIds
  )
  const validatedRecordedEvents = filterValidRecordedEvents(
    fetchedChildren.recordedEvents,
    validLanguageIds
  )
  const validatedTags = filterValidTags(fetchedChildren.tags)

  const imageIds = getSubjectChildImageIds({
    articles: fetchedChildren.articles,
    blogs: fetchedChildren.blogs,
    recordedEvents: fetchedChildren.recordedEvents,
    collections: fetchedChildren.collections,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getSubjectChildAuthorIds({
    articles: fetchedChildren.articles,
    blogs: fetchedChildren.blogs,
    recordedEvents: fetchedChildren.recordedEvents,
  })
  const fetchedAuthors = await fetchAuthors(authorIds)
  const validAuthors = filterValidAuthorsAsChildren(
    fetchedAuthors,
    globalData.languages.ids
  )

  const recordedEventTypeIds = fetchedChildren.recordedEvents.flatMap(
    (recordedEvent) =>
      recordedEvent.recordedEventTypeId
        ? [recordedEvent.recordedEventTypeId]
        : []
  )
  const fetchedRecordedEventTypes = await fetchRecordedEventTypes(
    recordedEventTypeIds
  )
  const validRecordedEventTypes = filterValidRecordedEventTypesAsChildren(
    fetchedRecordedEventTypes,
    globalData.languages.ids
  )

  const validatedChildren = {
    ...validateChildren(fetchedChildren, globalData.languages.ids),
    languages: filterAndMapEntitiesById(
      mapEntityLanguageIds(subject),
      globalData.languages.entities
    ),
  }

  const processedSubject = processSubjectForOwnPage({
    subject,
    validAuthors,
    processedChildren: {
      articles: validatedChildren.articles,
      blogs: validatedChildren.blogs,
      recordedEvents: validatedChildren.recordedEvents,
      collections: validatedChildren.collections,
    },
    validImages: fetchedImages,
    validLanguageIds: globalData.languages.ids,
    validRecordedEventTypes,
  })

  const pageData: StaticData = {
    subject: {
      ...processedSubject,
      languages: validatedChildren.languages,
      collections: validatedChildren.collections,
      tags: validatedChildren.tags,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
