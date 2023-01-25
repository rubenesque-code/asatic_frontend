import { GetStaticProps } from "next"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { removeArrDuplicates } from "^helpers/general"
import { processCollectionAsSummary } from "^helpers/process-fetched-data/collection/process"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"
import { fetchImages } from "^lib/firebase/firestore"

import { Language, SanitisedSubject } from "^types/entities"

export type StaticData = {
  collections: {
    entities: ReturnType<typeof processCollectionAsSummary>[]
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validCollections = await fetchAndValidateCollections({
    ids: "all",
    collectionRelation: "default",
    validLanguageIds: globalData.languages.ids,
  })

  const imageIds = getUniqueChildEntitiesImageIds({
    collections: validCollections.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedCollections = validCollections.entities.map((collection) =>
    processCollectionAsSummary(collection, {
      validImages: fetchedImages,
    })
  )

  const collectionLanguagesIds = removeArrDuplicates(
    processedCollections.flatMap((subject) => subject.languageId)
  )
  const collectionLanguages = collectionLanguagesIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.languages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    props: {
      collections: {
        entities: processedCollections,
        languages: collectionLanguages,
      },
      header: {
        subjects: globalData.subjects.entities,
      },
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}
