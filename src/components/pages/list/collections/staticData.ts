import { GetStaticProps } from "next"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { removeArrDuplicates } from "^helpers/general"
import { processCollectionsAsSummary } from "^helpers/process-fetched-data/collection/process"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"
import { fetchImages } from "^lib/firebase/firestore"

import { Language } from "^types/entities"
import { StaticDataWrapper } from "^types/staticData"

type PageData = {
  collections: ReturnType<typeof processCollectionsAsSummary>
  languages: Language[]
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validCollections = globalData.validatedData.allCollections.entities

  const imageIds = getUniqueChildEntitiesImageIds({
    collections: validCollections,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedCollections = processCollectionsAsSummary(validCollections, {
    validImages: fetchedImages,
  })

  const collectionLanguagesIds = removeArrDuplicates(
    processedCollections.flatMap((subject) => subject.languageId)
  )
  const collectionLanguages = collectionLanguagesIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    props: {
      globalData: globalData.globalContextData,
      pageData: {
        collections: processedCollections,
        languages: collectionLanguages,
      },
    },
  }
}
