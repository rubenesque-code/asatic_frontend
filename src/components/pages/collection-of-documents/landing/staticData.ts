import { GetStaticProps } from "next"

import { SanitisedSubject } from "^types/entities"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { fetchImages, fetchLanding } from "^lib/firebase/firestore"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { getRecordedEventTypeIds } from "^helpers/process-fetched-data/recorded-event/query"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionAsSummary } from "^helpers/process-fetched-data/collection/process"
import { getLandingUserSectionsUniqueChildIds } from "^helpers/process-fetched-data/landing/query"
import { processCustomSection } from "^helpers/process-fetched-data/landing/process"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"
import { fetchAndValidateDocumentEntities } from "^helpers/fetch-and-validate/_helpers"

export type StaticData = {
  landingSections: Awaited<ReturnType<typeof handleProcessSections>>
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()
  const allValidLanguageIds = globalData.languages.ids

  const processedSections = await handleProcessSections({
    validLanguageIds: allValidLanguageIds,
  })

  return {
    props: {
      header: {
        subjects: globalData.subjects.entities,
      },
      landingSections: processedSections,
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}

async function handleProcessSections({
  validLanguageIds,
}: {
  validLanguageIds: string[]
}) {
  const { firstSectionComponents, secondSectionComponents } =
    await handleProcessCustomSections({ validLanguageIds })
  const { collections, recordedEvents } =
    await handleProcessAutoSectionChildEntities({ validLanguageIds })

  return {
    firstSectionComponents,
    collections,
    recordedEvents,
    secondSectionComponents,
  }
}

async function handleProcessCustomSections({
  validLanguageIds,
}: {
  validLanguageIds: string[]
}) {
  const customSectionComponents = await fetchLanding()

  const userSectionEntityIds = getLandingUserSectionsUniqueChildIds(
    customSectionComponents
  )

  const validUserSectionEntities = await fetchAndValidateDocumentEntities({
    articleIds: userSectionEntityIds.articles,
    blogIds: userSectionEntityIds.blogs,
    validLanguageIds,
  })

  const validArticleLikeEntities = [
    ...validUserSectionEntities.articles.entities,
    ...validUserSectionEntities.blogs.entities,
  ]

  const imageIds = getUniqueChildEntitiesImageIds({
    articleLikeEntities: validArticleLikeEntities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getUniqueChildEntitiesIds(validArticleLikeEntities, [
    "authorsIds",
  ]).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds,
  })

  const processedArticleLikeEntities = validArticleLikeEntities.map(
    (articleLikeEntity) =>
      processArticleLikeEntityAsSummary({
        entity: articleLikeEntity,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds,
      })
  )

  const validEntityIds = [
    ...validUserSectionEntities.articles.ids,
    ...validUserSectionEntities.blogs.ids,
  ]

  const componentsWithValidatedEntities = customSectionComponents.filter(
    (component) => validEntityIds.includes(component.entity.id)
  )
  const firstSectionWithValidatedEntities =
    componentsWithValidatedEntities.filter(
      (component) => component.section === 0
    )
  const secondSectionWithValidatedEntities =
    componentsWithValidatedEntities.filter(
      (component) => component.section === 1
    )

  const firstSectionComponentsProcessed = processCustomSection(
    firstSectionWithValidatedEntities,
    {
      validChildEntities: { articleLikeEntities: processedArticleLikeEntities },
    }
  )
  const secondSectionComponentsProcessed = processCustomSection(
    secondSectionWithValidatedEntities,
    {
      validChildEntities: { articleLikeEntities: processedArticleLikeEntities },
    }
  )

  return {
    firstSectionComponents: firstSectionComponentsProcessed.length
      ? firstSectionComponentsProcessed
      : null,
    secondSectionComponents: secondSectionComponentsProcessed.length
      ? secondSectionComponentsProcessed
      : null,
  }
}

async function handleProcessAutoSectionChildEntities({
  validLanguageIds,
}: {
  validLanguageIds: string[]
}) {
  // 1. fetch and validate child entities
  // 2. process sections; populate components

  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: "all",
    validLanguageIds,
  })
  const validCollections = await fetchAndValidateCollections({
    ids: "all",
    validLanguageIds,
  })

  const imageIds = getUniqueChildEntitiesImageIds({
    recordedEvents: validRecordedEvents?.entities,
    collections: validCollections?.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const authorIds = getUniqueChildEntitiesIds(
    [...(validRecordedEvents?.entities || [])],
    ["authorsIds"]
  ).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds,
  })

  const recordedEventTypeIds = getRecordedEventTypeIds(
    validRecordedEvents?.entities || []
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

  const processedRecordedEvents = validRecordedEvents?.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        ...processDocumentEntitySharedArgs,
        validRecordedEventTypes: validRecordedEventTypes.entities,
      })
  )
  const processedCollections = validCollections?.entities.map((collection) =>
    processCollectionAsSummary(collection, {
      validImages: fetchedImages,
    })
  )

  return {
    recordedEvents: processedRecordedEvents.length
      ? processedRecordedEvents
      : null,
    collections: processedCollections.length ? processedCollections : null,
  }
}
