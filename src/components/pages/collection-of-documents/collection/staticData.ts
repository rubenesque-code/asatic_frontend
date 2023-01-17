import { GetStaticPaths, GetStaticProps } from "next"

import { Language, SanitisedSubject, Tag } from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import {
  getUniqueChildEntitiesIds,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data/general"
import { fetchCollection, fetchImages } from "^lib/firebase/firestore"
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
import { processCollectionForOwnPage } from "^helpers/process-fetched-data/collection/process"
import { getCollectionUniqueChildImageIds } from "^helpers/process-fetched-data/collection/query"

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

export type StaticData = {
  collection: ReturnType<typeof processCollectionForOwnPage> & {
    languages: Language[]
    tags: Tag[]
    subjects: SanitisedSubject[]
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

  const allValidLanguageIds = globalData.languages.ids

  const fetchedCollection = await fetchCollection(params?.id || "")

  const validArticles = await fetchAndValidateArticles({
    ids: fetchedCollection.articlesIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: fetchedCollection.blogsIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: fetchedCollection.recordedEventsIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validTags = await fetchAndValidateTags({
    ids: fetchedCollection.tagsIds,
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
    validLanguageIds: allValidLanguageIds,
  })

  const recordedEventTypeIds = getRecordedEventTypeIds(
    validRecordedEvents.entities
  )
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: recordedEventTypeIds,
    validLanguageIds: allValidLanguageIds,
  })

  const processedArticles = validArticles.entities.map((article) =>
    processArticleLikeEntityAsSummary({
      entity: article,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: allValidLanguageIds,
    })
  )
  const processedBlogs = validBlogs.entities.map((blog) =>
    processArticleLikeEntityAsSummary({
      entity: blog,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: allValidLanguageIds,
    })
  )
  const processedRecordedEvents = validRecordedEvents.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds: allValidLanguageIds,
        validRecordedEventTypes: validRecordedEventTypes.entities,
      })
  )

  const processedCollection = processCollectionForOwnPage(fetchedCollection, {
    processedChildDocumentEntities: {
      articles: processedArticles,
      blogs: processedBlogs,
      recordedEvents: processedRecordedEvents,
    },
    validLanguageIds: allValidLanguageIds,
    validImages: fetchedImages,
  })

  const pageData: StaticData = {
    collection: {
      ...processedCollection,
      languages: filterAndMapEntitiesById(
        mapEntityLanguageIds(processedCollection),
        globalData.languages.entities
      ),
      tags: validTags.entities,
      subjects: filterAndMapEntitiesById(
        fetchedCollection.subjectsIds,
        globalData.subjects.entities
      ),
    },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
