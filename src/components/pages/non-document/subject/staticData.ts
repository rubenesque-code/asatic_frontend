import { GetStaticPaths, GetStaticProps } from "next"

import { Language, SanitisedSubject, Tag } from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import {
  getUniqueChildEntityIds,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data/general"
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
    languages: Language[]
    collections: ReturnType<typeof processCollectionAsSummary>[]
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

  const allValidLanguageIds = globalData.languages.ids

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const subject = globalData.subjects.entities.find(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (subject) => subject.id === params!.id
  )!

  const validArticles = await fetchAndValidateArticles({
    ids: subject.articlesIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: subject.blogsIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: subject.recordedEventsIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validTags = await fetchAndValidateTags({
    ids: subject.tagsIds,
  })

  const validCollections = await fetchAndValidateCollections({
    collectionIds: subject.collectionsIds,
    collectionRelation: "default",
    validLanguageIds: allValidLanguageIds,
  })

  const imageIds = getSubjectChildImageIds({
    articles: validArticles.entities,
    blogs: validBlogs.entities,
    recordedEvents: validRecordedEvents.entities,
    collections: validCollections.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getUniqueChildEntityIds(
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
  const processedCollections = validCollections.entities.map((collection) =>
    processCollectionAsSummary(collection, {
      validImages: fetchedImages,
      validLanguageIds: allValidLanguageIds,
    })
  )

  const processedSubject = processSubjectForOwnPage(subject, {
    processedChildDocumentEntities: {
      articles: processedArticles,
      blogs: processedBlogs,
      recordedEvents: processedRecordedEvents,
    },
    validLanguageIds: allValidLanguageIds,
  })

  const pageData: StaticData = {
    subject: {
      ...processedSubject,
      languages: filterAndMapEntitiesById(
        mapEntityLanguageIds(processedSubject),
        globalData.languages.entities
      ),
      collections: processedCollections,
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
