import { GetStaticPaths, GetStaticProps } from "next"

import { fetchArticle, fetchImages } from "^lib/firebase/firestore"

import { filterAndMapEntitiesById } from "^helpers/data"
import {
  getArticleLikeDocumentImageIds,
  processArticleLikeEntityForOwnPage,
} from "^helpers/process-fetched-data/article-like"
import { mapEntityLanguageIds } from "^helpers/process-fetched-data/general"
import { StaticData } from "../_types"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchChildEntities } from "^helpers/fetch-data"
import { validateChildren } from "^helpers/process-fetched-data/validate-wrapper"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedArticles = await fetchAndValidateArticles({ ids: "all" })

  if (!fetchedArticles.entities) {
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

  const fetchedArticle = await fetchArticle(params?.id || "")

  const fetchedChildren = await fetchChildEntities(fetchedArticle)

  const imageIds = getArticleLikeDocumentImageIds(fetchedArticle.translations)
  const fetchedImages = await fetchImages(imageIds)

  const validatedChildren = {
    ...validateChildren(fetchedChildren, globalData.languages.ids),
    subjects: filterAndMapEntitiesById(
      fetchedArticle.subjectsIds,
      globalData.subjects.entities
    ),
    languages: filterAndMapEntitiesById(
      mapEntityLanguageIds(fetchedArticle),
      globalData.languages.entities
    ),
  }

  const processedArticle = processArticleLikeEntityForOwnPage({
    entity: fetchedArticle,
    validLanguageIds: globalData.languages.ids,
    validImages: fetchedImages,
  })

  const pageData: StaticData = {
    entity: { ...processedArticle, ...validatedChildren },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
