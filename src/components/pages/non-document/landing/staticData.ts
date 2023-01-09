import { GetStaticPaths, GetStaticProps } from "next"

import { Language, SanitisedSubject, Tag } from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import {
  getUniqueChildEntitiesIds,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data/general"
import { getSubjectChildImageIds } from "^helpers/process-fetched-data/subject/query"
import { fetchImages, fetchLanding } from "^lib/firebase/firestore"
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
import { fetchAndValidateLanding } from "^helpers/fetch-and-validate/landing"
import { getLandingUserSectionsUniqueChildIds } from "^helpers/process-fetched-data/landing/query"
import { validateUserSection } from "^helpers/process-fetched-data/landing/validate"
import { processUserSections } from "^helpers/process-fetched-data/landing/process"
import { getUniqueDocumentEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"

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

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()
  const allValidLanguageIds = globalData.languages.ids

  const sections = await fetchLanding()

  const userSections = sections.flatMap((section) =>
    section.type === "user" ? section : []
  )

  const userSectionChildIds = getLandingUserSectionsUniqueChildIds(userSections)

  const validUserSectionChildEntities = {
    articles: await fetchAndValidateArticles({
      ids: userSectionChildIds.articles,
      validLanguageIds: allValidLanguageIds,
    }),
    blogs: await fetchAndValidateBlogs({
      ids: userSectionChildIds.blogs,
      validLanguageIds: allValidLanguageIds,
    }),
    recordedEvents: await fetchAndValidateRecordedEvents({
      ids: userSectionChildIds.recordedEvents,
      validLanguageIds: allValidLanguageIds,
    }),
  }

  const validUserSections = userSections.filter((section) =>
    validateUserSection(section, {
      validDocumentEntityIds: {
        articles: validUserSectionChildEntities.articles.ids,
        blogs: validUserSectionChildEntities.blogs.ids,
        recordedEvents: validUserSectionChildEntities.recordedEvents.ids,
      },
    })
  )

  const imageIds = getUniqueDocumentEntitiesImageIds({
    articles: validUserSectionChildEntities.articles.entities,
    blogs: validUserSectionChildEntities.blogs.entities,
    recordedEvents: validUserSectionChildEntities.recordedEvents.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getUniqueChildEntitiesIds(
    [
      ...validUserSectionChildEntities.articles.entities,
      ...validUserSectionChildEntities.blogs.entities,
      ...validUserSectionChildEntities.recordedEvents.entities,
    ],
    ["authorsIds"]
  ).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: allValidLanguageIds,
  })

  const recordedEventTypeIds = getRecordedEventTypeIds(
    validUserSectionChildEntities.recordedEvents.entities
  )
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: recordedEventTypeIds,
    validLanguageIds: allValidLanguageIds,
  })

  const processedArticles = validUserSectionChildEntities.articles.entities.map(
    (article) =>
      processArticleLikeEntityAsSummary({
        entity: article,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds: allValidLanguageIds,
      })
  )
  const processedBlogs = validUserSectionChildEntities.blogs.entities.map(
    (blog) =>
      processArticleLikeEntityAsSummary({
        entity: blog,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds: allValidLanguageIds,
      })
  )
  const processedRecordedEvents =
    validUserSectionChildEntities.recordedEvents.entities.map((recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds: allValidLanguageIds,
        validRecordedEventTypes: validRecordedEventTypes.entities,
      })
    )

  const processedUserSections = processUserSections(validUserSections, {
    validChildEntities: {
      articles: processedArticles,
      blogs: processedBlogs,
      recordedEvents: processedRecordedEvents,
    },
  })

  return {
    props: pageData,
  }
}
