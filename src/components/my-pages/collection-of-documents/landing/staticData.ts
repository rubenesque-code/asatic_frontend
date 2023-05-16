import { GetStaticProps } from "next"

import {
  fetchAndValidateGlobalData,
  GlobalDataValidated,
} from "^helpers/fetch-and-validate/global"
import { fetchImages, fetchLanding } from "^lib/firebase/firestore"

import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { processRecordedEventsAsSummarries } from "^helpers/process-fetched-data/recorded-event/process"
import { processCollectionsAsSummaries } from "^helpers/process-fetched-data/collection/process"
import { getLandingUserSectionsUniqueChildIds } from "^helpers/process-fetched-data/landing/query"
import { processCustomSection } from "^helpers/process-fetched-data/landing/process"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"
import { fetchAndValidateDocumentEntities } from "^helpers/fetch-and-validate/_helpers"
import { StaticDataWrapper } from "^types/staticData"
import { handleProcessAuthorsAsChildren } from "^helpers/process-fetched-data/author/compose"
import { handleProcessRecordedEventTypesAsChildren } from "^helpers/process-fetched-data/recorded-event-type/compose"

type PageData = {
  landingSections: Awaited<ReturnType<typeof handleProcessSections>>
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const processedSections = await handleProcessSections({
    globalData: globalData.validatedData,
  })

  return {
    props: {
      globalData: globalData.globalContextData,
      pageData: {
        landingSections: processedSections,
      },
    },
  }
}

async function handleProcessSections({
  globalData,
}: {
  globalData: GlobalDataValidated
}) {
  const { firstSectionComponents, secondSectionComponents } =
    await handleProcessCustomSections({ globalData })
  const { collections, recordedEvents } =
    await handleProcessAutoSectionChildEntities({
      globalData,
    })

  return {
    firstSectionComponents,
    collections,
    recordedEvents,
    secondSectionComponents,
  }
}

async function handleProcessCustomSections({
  globalData,
}: {
  globalData: GlobalDataValidated
}) {
  const customSectionComponents = await fetchLanding()

  const userSectionEntityIds = getLandingUserSectionsUniqueChildIds(
    customSectionComponents
  )

  const validUserSectionEntities = await fetchAndValidateDocumentEntities({
    articleIds: userSectionEntityIds.articles,
    blogIds: userSectionEntityIds.blogs,
    validLanguageIds: globalData.allLanguages.ids,
  })

  const validArticleLikeEntities = [
    ...validUserSectionEntities.articles.entities,
    ...validUserSectionEntities.blogs.entities,
  ]

  const imageIds = getUniqueChildEntitiesImageIds({
    articleLikeEntities: validArticleLikeEntities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedAuthors = await handleProcessAuthorsAsChildren(
    validArticleLikeEntities,
    {
      validLanguageIds: globalData.allLanguages.ids,
      allValidAuthors: globalData.allAuthors.entities,
    }
  )

  const processedArticleLikeEntities = validArticleLikeEntities.map(
    (articleLikeEntity) =>
      processArticleLikeEntityAsSummary(articleLikeEntity, {
        processedAuthors,
        validImages: fetchedImages,
        validLanguageIds: globalData.allLanguages.ids,
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
  globalData,
}: {
  globalData: GlobalDataValidated
}) {
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: "all",
    validLanguageIds: globalData.allLanguages.ids,
  })

  const imageIds = getUniqueChildEntitiesImageIds({
    recordedEvents: validRecordedEvents.entities,
    collections: globalData.allCollections.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedAuthors = await handleProcessAuthorsAsChildren(
    validRecordedEvents.entities,
    {
      validLanguageIds: globalData.allLanguages.ids,
      allValidAuthors: globalData.allAuthors.entities,
    }
  )

  const processedRecordedEventTypes =
    await handleProcessRecordedEventTypesAsChildren(
      validRecordedEvents.entities,
      { validLanguageIds: globalData.allLanguages.ids }
    )

  const processedRecordedEvents = processRecordedEventsAsSummarries(
    validRecordedEvents.entities,
    {
      processedAuthors,
      processedRecordedEventTypes,
      validImages: fetchedImages,
      validLanguageIds: globalData.allLanguages.ids,
    }
  )

  const processedCollections = processCollectionsAsSummaries(
    globalData.allCollections.entities,
    { validImages: fetchedImages }
  )

  return {
    recordedEvents: processedRecordedEvents.length
      ? processedRecordedEvents
      : null,
    collections: processedCollections.length ? processedCollections : null,
  }
}
