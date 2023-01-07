import { GetStaticProps } from "next"
import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import {
  getArticleLikeEntitiesImageIds,
  processArticleLikeEntityAsSummary,
} from "^helpers/process-fetched-data/article-like"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { getEntitiesUniqueLanguageIds } from "^helpers/queryEntity"
import { fetchImages } from "^lib/firebase/firestore"
import { StaticData } from "../_types"

// article as summary

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validArticles = await fetchAndValidateArticles({
    ids: "all",
    validLanguageIds: globalData.languages.ids,
  })

  const authorIds = getUniqueChildEntitiesIds(validArticles.entities, [
    "authorsIds",
  ]).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: globalData.languages.ids,
  })

  const imageIds = getArticleLikeEntitiesImageIds(validArticles.entities)
  const fetchedImages = await fetchImages(imageIds)

  const processedArticles = validArticles.entities.map((article) =>
    processArticleLikeEntityAsSummary({
      entity: article,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: globalData.languages.ids,
      summaryType: "default",
    })
  )

  const languageIds = getEntitiesUniqueLanguageIds(processedArticles)

  return {
    props: {
      articleLikeEntities: {
        entities: processedArticles,
        languages: filterAndMapEntitiesById(
          languageIds,
          globalData.languages.entities
        ),
      },
      header: {
        subjects: globalData.subjects.entities,
      },
    },
  }
}
