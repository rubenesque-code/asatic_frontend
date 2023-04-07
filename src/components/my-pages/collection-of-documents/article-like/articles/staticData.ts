import { GetStaticProps } from "next"

import { fetchImages } from "^lib/firebase/firestore"

import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import {
  fetchAndValidateGlobalData,
  GlobalDataValidated,
} from "^helpers/fetch-and-validate/global"
import { processArticleLikeEntitiesAsSummarries } from "^helpers/process-fetched-data/article-like"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"

import { PageData } from "../_types"
import { mapIds } from "^helpers/data"
import { StaticDataWrapper } from "^types/staticData"
import { handleProcessAuthorsAsChildren } from "^helpers/process-fetched-data/author/compose"
import { getEntitiesUniqueLanguagesAndProcess } from "^helpers/process-fetched-data/language/compose"

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const processedArticles = await handleProcessArticles({
    globalData: globalData.validatedData,
  })

  return {
    props: {
      globalData: {
        ...globalData.globalContextData,
        documentLanguageIds: mapIds(processedArticles.languages),
      },
      pageData: {
        articleLikeEntities: processedArticles.entities,
        languages: processedArticles.languages,
      },
    },
  }
}

async function handleProcessArticles({
  globalData,
}: {
  globalData: GlobalDataValidated
}) {
  const validArticles = await fetchAndValidateArticles({
    ids: "all",
    validLanguageIds: globalData.allLanguages.ids,
  })

  const processedAuthors = await handleProcessAuthorsAsChildren(
    validArticles.entities,
    {
      validLanguageIds: globalData.allLanguages.ids,
    }
  )

  const imageIds = getUniqueChildEntitiesImageIds({
    articleLikeEntities: validArticles.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedArticles = processArticleLikeEntitiesAsSummarries(
    validArticles.entities,
    {
      processedAuthors,
      validImages: fetchedImages,
      validLanguageIds: globalData.allLanguages.ids,
    }
  )

  const articleLanguages = getEntitiesUniqueLanguagesAndProcess(
    processedArticles,
    globalData.allLanguages.entities
  )

  return {
    entities: processedArticles,
    languages: articleLanguages,
  }
}
