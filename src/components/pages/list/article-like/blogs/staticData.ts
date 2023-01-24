import { GetStaticProps } from "next"

import { fetchImages } from "^lib/firebase/firestore"

import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { processArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { getUniqueChildEntitiesImageIds } from "^helpers/process-fetched-data/_helpers/query"

import { StaticData } from "../_types"
import { mapLanguageIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const processedBlogs = await handleProcessBlogs({
    validLanguages: globalData.languages,
  })

  return {
    props: {
      articleLikeEntities: processedBlogs,
      header: {
        subjects: globalData.subjects.entities,
      },
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}

async function handleProcessBlogs({
  validLanguages,
}: {
  validLanguages: Awaited<
    ReturnType<typeof fetchAndValidateGlobalData>
  >["languages"]
}) {
  const validBlogs = await fetchAndValidateBlogs({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })

  const authorIds = getUniqueChildEntitiesIds(validBlogs.entities, [
    "authorsIds",
  ]).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: validLanguages.ids,
  })

  const imageIds = getUniqueChildEntitiesImageIds({
    articleLikeEntities: validBlogs.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedBlogs = validBlogs.entities.map((articleLikeEntity) =>
    processArticleLikeEntityAsSummary({
      entity: articleLikeEntity,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: validLanguages.ids,
    })
  )

  const blogLanguageIds = removeArrDuplicates(
    mapLanguageIds(processedBlogs.flatMap((blog) => blog.translations))
  )
  const blogLanguages = blogLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    entities: processedBlogs,
    languages: blogLanguages,
  }
}
