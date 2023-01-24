import { GetStaticProps } from "next"

import { fetchImages } from "^lib/firebase/firestore"

import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
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

  const processedArticles = await handleProcessArticles({
    validLanguages: globalData.languages,
  })

  return {
    props: {
      articles: processedArticles,
      header: {
        subjects: globalData.subjects.entities,
      },
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}

async function handleProcessArticles({
  validLanguages,
}: {
  validLanguages: Awaited<
    ReturnType<typeof fetchAndValidateGlobalData>
  >["languages"]
}) {
  const validArticles = await fetchAndValidateArticles({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })

  const authorIds = getUniqueChildEntitiesIds(validArticles.entities, [
    "authorsIds",
  ]).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: validLanguages.ids,
  })

  const imageIds = getUniqueChildEntitiesImageIds({
    articleLikeEntities: validArticles.entities,
  })
  const fetchedImages = await fetchImages(imageIds)

  const processedArticles = validArticles.entities.map((articleLikeEntity) =>
    processArticleLikeEntityAsSummary({
      entity: articleLikeEntity,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: validLanguages.ids,
    })
  )

  const articleLanguageIds = removeArrDuplicates(
    mapLanguageIds(processedArticles.flatMap((article) => article.translations))
  )
  const articleLanguages = articleLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    entities: processedArticles,
    languages: articleLanguages,
  }
}
