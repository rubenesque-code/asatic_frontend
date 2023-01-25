import { GetStaticPaths, GetStaticProps } from "next"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { fetchImages } from "^lib/firebase/firestore"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { getRecordedEventTypeIds } from "^helpers/process-fetched-data/recorded-event/query"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionForOwnPage } from "^helpers/process-fetched-data/collection/process"
import { getCollectionUniqueChildImageIds } from "^helpers/process-fetched-data/collection/query"
import { StaticDataWrapper } from "^types/staticData"

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
