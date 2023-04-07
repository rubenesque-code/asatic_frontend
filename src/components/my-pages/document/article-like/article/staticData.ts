import { GetStaticPaths, GetStaticProps } from "next"

import { fetchArticle, fetchImages } from "^lib/firebase/firestore"

import { mapLanguageIds } from "^helpers/data"
import {
  getArticleLikeDocumentImageIds,
  processArticleLikeEntityForOwnPage,
} from "^helpers/process-fetched-data/article-like"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"

import { StaticData } from "../_types"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedArticles = await fetchAndValidateArticles({ ids: "all" })

  if (!fetchedArticles.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = fetchedArticles.ids.map((id) => ({
    params: {
      id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fetchedArticle = await fetchArticle(params!.id)

  const validAuthors = fetchedArticle.authorsIds.map(
    (authorId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allAuthors.entities.find(
        (author) => author.id === authorId
      )!
  )

  const imageIds = getArticleLikeDocumentImageIds(fetchedArticle.translations)
  const fetchedImages = await fetchImages(imageIds)

  const processedArticle = processArticleLikeEntityForOwnPage(fetchedArticle, {
    validLanguageIds: globalData.validatedData.allLanguages.ids,
    validImages: fetchedImages,
  })

  const articleLanguageIds = mapLanguageIds(processedArticle.translations)
  const articleLanguages = articleLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  const pageData: StaticData = {
    globalData: {
      ...globalData.globalContextData,
      documentLanguageIds: articleLanguageIds,
    },
    pageData: {
      articleLikeEntity: processedArticle,
      authors: validAuthors,
      languages: articleLanguages,
    },
  }

  return {
    props: pageData,
  }
}
