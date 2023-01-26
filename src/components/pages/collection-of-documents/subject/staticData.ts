import { GetStaticPaths, GetStaticProps } from "next"

import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { getSubjectChildImageIds } from "^helpers/process-fetched-data/subject/query"
import { fetchImages } from "^lib/firebase/firestore"
import { processSubjectForOwnPage } from "^helpers/process-fetched-data/subject/process"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { getRecordedEventTypeIds } from "^helpers/process-fetched-data/recorded-event/query"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionAsSummary } from "^helpers/process-fetched-data/collection/process"
import { StaticDataWrapper } from "^types/staticData"
import { MyOmit } from "^types/utilities"

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

type PageData = {
  subject: MyOmit<ReturnType<typeof processSubjectForOwnPage>, "customSections">
  customSections: ReturnType<typeof processSubjectForOwnPage>["customSections"]
  collections: ReturnType<typeof processCollectionAsSummary>[]
  recordedEvents: ReturnType<typeof processRecordedEventAsSummary>[]
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const subject = globalData.validatedData.allSubjects.entities.find(
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
  const { customSections, ...restOfProcessedSubject } = processedSubject

  const pageData: StaticData = {
    globalData: globalData.globalContextData,
    pageData: {
      subject: restOfProcessedSubject,
      customSections,
      collections: processedCollections,
      recordedEvents: processedRecordedEvents,
    },
  }

  return {
    props: pageData,
  }
}
