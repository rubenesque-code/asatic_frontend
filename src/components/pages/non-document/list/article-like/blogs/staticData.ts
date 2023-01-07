import { GetStaticProps } from "next"
import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import {
  getArticleLikeEntitiesImageIds,
  processArticleLikeEntityAsSummary,
} from "^helpers/process-fetched-data/article-like"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { getEntitiesUniqueLanguageIds } from "^helpers/queryEntity"
import { fetchImages } from "^lib/firebase/firestore"
import { StaticData } from "../_types"

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validBlogs = await fetchAndValidateBlogs({
    ids: "all",
    validLanguageIds: globalData.languages.ids,
  })

  const authorIds = getUniqueChildEntitiesIds(validBlogs.entities, [
    "authorsIds",
  ]).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: globalData.languages.ids,
  })

  const imageIds = getArticleLikeEntitiesImageIds(validBlogs.entities)
  const fetchedImages = await fetchImages(imageIds)

  const processedBlogs = validBlogs.entities.map((blog) =>
    processArticleLikeEntityAsSummary({
      entity: blog,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: globalData.languages.ids,
      summaryType: "default",
    })
  )

  const languageIds = getEntitiesUniqueLanguageIds(processedBlogs)

  return {
    props: {
      articleLikeEntities: {
        entities: processedBlogs,
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
