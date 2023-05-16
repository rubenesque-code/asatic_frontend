import { GetStaticPaths, GetStaticProps } from "next"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchImages } from "^lib/firebase/firestore"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionForOwnPage } from "^helpers/process-fetched-data/collection/process"
import { getCollectionUniqueChildImageIds } from "^helpers/process-fetched-data/collection/query"
import { StaticDataWrapper } from "^types/staticData"
import { handleProcessAuthorsAsChildren } from "^helpers/process-fetched-data/author/compose"
import { handleProcessRecordedEventTypesAsChildren } from "^helpers/process-fetched-data/recorded-event-type/compose"

type PageData = { collection: ReturnType<typeof processCollectionForOwnPage> }

export type StaticData = StaticDataWrapper<PageData>

export const getStaticPaths: GetStaticPaths = async () => {
  const validCollections = await fetchAndValidateCollections({ ids: "all" })

  if (!validCollections.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validCollections.ids.map((id) => ({
    params: {
      id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  const fetchedCollection =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    globalData.validatedData.allCollections.entities.find(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (collection) => collection.id === params!.id
    )!

  const validLanguageIds = [fetchedCollection.languageId]

  const validArticles = await fetchAndValidateArticles({
    ids: fetchedCollection.articlesIds,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: fetchedCollection.blogsIds,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: fetchedCollection.recordedEventsIds,
    validLanguageIds,
  })

  const imageIds = [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fetchedCollection.bannerImage.imageId!,
    ...getCollectionUniqueChildImageIds({
      articles: validArticles.entities,
      blogs: validBlogs.entities,
      recordedEvents: validRecordedEvents.entities,
    }),
  ]
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

  const processedCollection = processCollectionForOwnPage(fetchedCollection, {
    processedChildDocumentEntities: {
      articles: processedArticles,
      blogs: processedBlogs,
      recordedEvents: processedRecordedEvents,
    },
    validImages: fetchedImages,
  })

  const pageData: StaticData = {
    globalData: globalData.globalContextData,
    pageData: { collection: processedCollection },
  }

  return {
    props: pageData,
  }
}
