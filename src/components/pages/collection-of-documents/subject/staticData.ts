import { GetStaticPaths, GetStaticProps } from "next"

import { SanitisedSubject, Tag } from "^types/entities"

import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { getSubjectChildImageIds } from "^helpers/process-fetched-data/subject/query"
import { fetchImages } from "^lib/firebase/firestore"
import { processSubjectForOwnPage } from "^helpers/process-fetched-data/subject/process"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateTags } from "^helpers/fetch-and-validate/tags"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { getRecordedEventTypeIds } from "^helpers/process-fetched-data/recorded-event/query"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionAsSummary } from "^helpers/process-fetched-data/collection/process"

export const getStaticPaths: GetStaticPaths = async () => {
  const validSubjects = await fetchAndValidateSubjects({ ids: "all" })

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
    collections: ReturnType<typeof processCollectionAsSummary>[]
    recordedEvents: ReturnType<typeof processRecordedEventAsSummary>[]
    tags: Tag[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const subject = globalData.subjects.entities.find(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (subject) => subject.id === params!.id
  )!

  const validLanguageIds = [subject.languageId]

  const validArticles = await fetchAndValidateArticles({
    ids: subject.articlesIds,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: subject.blogsIds,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: subject.recordedEventsIds,
    validLanguageIds,
  })
  const validTags = await fetchAndValidateTags({
    ids: subject.tagsIds,
  })

  const validCollections = await fetchAndValidateCollections({
    ids: subject.collectionsIds,
    collectionRelation: "default",
    validLanguageIds,
  })

  const imageIds = getSubjectChildImageIds({
    articles: validArticles.entities,
    blogs: validBlogs.entities,
    recordedEvents: validRecordedEvents.entities,
    collections: validCollections.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getUniqueChildEntitiesIds(
    [
      ...validArticles.entities,
      ...validBlogs.entities,
      ...validRecordedEvents.entities,
    ],
    ["authorsIds"]
  ).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds,
  })

  const recordedEventTypeIds = getRecordedEventTypeIds(
    validRecordedEvents.entities
  )
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: recordedEventTypeIds,
    validLanguageIds,
  })

  const processDocumentEntitySharedArgs = {
    validAuthors: validAuthors.entities,
    validImages: fetchedImages,
    validLanguageIds,
  }

  const processedArticles = validArticles.entities.map((article) =>
    processArticleLikeEntityAsSummary({
      entity: article,
      ...processDocumentEntitySharedArgs,
    })
  )
  const processedBlogs = validBlogs.entities.map((blog) =>
    processArticleLikeEntityAsSummary({
      entity: blog,
      ...processDocumentEntitySharedArgs,
    })
  )
  const processedRecordedEvents = validRecordedEvents.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validRecordedEventTypes: validRecordedEventTypes.entities,
        ...processDocumentEntitySharedArgs,
      })
  )
  const processedCollections = validCollections.entities.map((collection) =>
    processCollectionAsSummary(collection, {
      validImages: fetchedImages,
    })
  )

  const processedSubject = processSubjectForOwnPage(subject, {
    processedChildDocumentEntities: {
      articles: processedArticles,
      blogs: processedBlogs,
    },
  })

  const pageData: StaticData = {
    subject: {
      ...processedSubject,
      collections: processedCollections,
      recordedEvents: processedRecordedEvents,
      tags: validTags.entities,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
    isMultipleAuthors: globalData.isMultipleAuthors,
  }

  return {
    props: pageData,
  }
}
