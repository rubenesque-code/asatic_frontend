import { GetStaticPaths, GetStaticProps } from "next"

import { fetchArticle, fetchArticles } from "^lib/firebase/firestore"

import { filterAndMapEntitiesById } from "^helpers/data"
import {
  filterValidArticleLikeEntities,
  processArticleLikeEntityForOwnPage,
} from "^helpers/process-fetched-data/article-like"
import {
  mapEntitiesLanguageIds,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data/general"
import { fetchAndValidateGlobalData } from "^helpers/static-data/global"
import { fetchAndValidateLanguages } from "^helpers/static-data/languages"
import { fetchChildren, validateChildren } from "^helpers/static-data/helpers"
import { StaticData } from "../_types"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedArticles = await fetchArticles()

  if (!fetchedArticles.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const languages = await fetchAndValidateLanguages(
    mapEntitiesLanguageIds(fetchedArticles)
  )

  const validArticles = filterValidArticleLikeEntities(
    fetchedArticles,
    languages.ids
  )

  if (!validArticles.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validArticles.map((article) => ({
    params: {
      id: article.id,
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

  const fetchedChildren = await fetchChildren(fetchedArticle)

  const { images: fetchedImages, ...nonImageFetchedChildren } = fetchedChildren

  const validatedChildren = {
    ...validateChildren(nonImageFetchedChildren, globalData.languages.ids),
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
