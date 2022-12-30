import { GetStaticPaths, GetStaticProps } from "next"

import { fetchArticle, fetchArticles } from "^lib/firebase/firestore"

import {
  Author,
  Language,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import { filterAndMapEntitiesById } from "^helpers/data"
import {
  mapEntitiesLanguageIds,
  filterValidArticleLikeEntities,
  mapEntityLanguageIds,
  processArticleLikeEntityForOwnPage,
} from "^helpers/process-fetched-data"
import { fetchAndValidateGlobalData } from "^helpers/static-data/global"
import { fetchAndValidateLanguages } from "^helpers/static-data/languages"
import { fetchChildren, validateChildren } from "^helpers/static-data/helpers"

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

export type StaticData = {
  article: ReturnType<typeof processArticleLikeEntityForOwnPage> & {
    subjects: SanitisedSubject[]
    languages: Language[]
    authors: Author[]
    collections: SanitisedCollection[]
    tags: Tag[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // * won't get to this point if article doesn't exist, so below workaround for fetching article is fine
  const fetchedArticle = await fetchArticle(params?.id || "")

  const fetchedChildren = await fetchChildren(fetchedArticle)

  const validatedChildren = {
    ...validateChildren(
      {
        authors: fetchedChildren.authors,
        collections: fetchedChildren.collections,
        tags: fetchedChildren.tags,
      },
      globalData.languages.ids
    ),
    subjects: filterAndMapEntitiesById(
      fetchedArticle.subjectsIds,
      globalData.subjects.entities
    ),
    languages: filterAndMapEntitiesById(
      mapEntityLanguageIds(fetchedArticle),
      globalData.languages.entities
    ),
  }

  // should remove invalid image sections too (without corresponding fetched image)
  const processedArticle = processArticleLikeEntityForOwnPage({
    entity: fetchedArticle,
    validLanguageIds: globalData.languages.ids,
    validImages: fetchedChildren.images,
  })

  const pageData: StaticData = {
    article: { ...processedArticle, ...validatedChildren },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
