import { GetStaticPaths, GetStaticProps } from "next"

import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { getSubjectChildImageIds } from "^helpers/process-fetched-data/subject/query"
import { fetchImages, fetchSubject } from "^lib/firebase/firestore"
import { processSubjectForOwnPage } from "^helpers/process-fetched-data/subject/process"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionAsSummary } from "^helpers/process-fetched-data/collection/process"
import { StaticDataWrapper } from "^types/staticData"
import { MyOmit } from "^types/utilities"
import { handleProcessAuthorsAsChildren } from "^helpers/process-fetched-data/author/compose"
import { handleProcessRecordedEventTypesAsChildren } from "^helpers/process-fetched-data/recorded-event-type/compose"

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
  const fetchedSubject = await fetchSubject(params!.id)

  const validLanguageIds = [fetchedSubject.languageId]

  const validArticles = await fetchAndValidateArticles({
    ids: fetchedSubject.articlesIds,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: fetchedSubject.blogsIds,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: fetchedSubject.recordedEventsIds,
    validLanguageIds,
  })

  const validCollections = await fetchAndValidateCollections({
    ids: fetchedSubject.collectionsIds,
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

  const processedAuthors = await handleProcessAuthorsAsChildren(
    [
      ...validArticles.entities,
      ...validBlogs.entities,
      ...validRecordedEvents.entities,
    ],
    {
      validLanguageIds: globalData.validatedData.allLanguages.ids,
      allValidAuthors: globalData.validatedData.allAuthors.entities,
    }
  )

  const processedRecordedEventTypes =
    await handleProcessRecordedEventTypesAsChildren(
      validRecordedEvents.entities,
      {
        validLanguageIds: globalData.validatedData.allLanguages.ids,
      }
    )

  const processDocumentEntitySharedArgs = {
    processedAuthors,
    validImages: fetchedImages,
    validLanguageIds,
  }

  const processedArticles = validArticles.entities.map((article) =>
    processArticleLikeEntityAsSummary(article, {
      ...processDocumentEntitySharedArgs,
    })
  )
  const processedBlogs = validBlogs.entities.map((blog) =>
    processArticleLikeEntityAsSummary(blog, {
      ...processDocumentEntitySharedArgs,
    })
  )
  const processedRecordedEvents = validRecordedEvents.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary(recordedEvent, {
        processedRecordedEventTypes,
        ...processDocumentEntitySharedArgs,
      })
  )
  const processedCollections = validCollections.entities.map((collection) =>
    processCollectionAsSummary(collection, {
      validImages: fetchedImages,
    })
  )

  const processedSubject = processSubjectForOwnPage(fetchedSubject, {
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
