import { GetStaticProps } from "next"

import { fetchImages } from "^lib/firebase/firestore"

import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
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

  const processedBlogs = await handleProcessBlogs({
    globalData: globalData.validatedData,
  })

  return {
    props: {
      globalData: {
        ...globalData.globalContextData,
        documentLanguageIds: mapIds(processedBlogs.languages),
      },
      pageData: {
        articleLikeEntities: processedBlogs.entities,
        languages: processedBlogs.languages,
      },
    },
  }
}

async function handleProcessBlogs({
  globalData,
}: {
  globalData: GlobalDataValidated
}) {
  const validBlogs = await fetchAndValidateBlogs({
    ids: "all",
    validLanguageIds: globalData.allLanguages.ids,
  })

  const processedAuthors = await handleProcessAuthorsAsChildren(
    validBlogs.entities,
    {
      validLanguageIds: globalData.allLanguages.ids,
    }
  )

  const imageIds = getUniqueChildEntitiesImageIds({
    articleLikeEntities: validBlogs.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedBlogs = processArticleLikeEntitiesAsSummarries(
    validBlogs.entities,
    {
      processedAuthors,
      validImages: fetchedImages,
      validLanguageIds: globalData.allLanguages.ids,
    }
  )

  const blogLanguages = getEntitiesUniqueLanguagesAndProcess(
    processedBlogs,
    globalData.allLanguages.entities
  )

  return {
    entities: processedBlogs,
    languages: blogLanguages,
  }
}
