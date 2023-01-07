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
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateTags } from "^helpers/fetch-and-validate/tags"

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

  const fetchedArticle = await fetchArticle(params?.id || "")

  const validAuthors = await fetchAndValidateAuthors({
    ids: fetchedArticle.authorsIds,
    validLanguageIds: globalData.languages.ids,
  })
  const validCollections = await fetchAndValidateCollections({
    ids: fetchedArticle.collectionsIds,
    collectionRelation: "child-of-document",
    validLanguageIds: globalData.languages.ids,
  })
  const validTags = await fetchAndValidateTags({
    ids: fetchedArticle.tagsIds,
  })

  const imageIds = getArticleLikeDocumentImageIds(fetchedArticle.translations)
  const fetchedImages = await fetchImages(imageIds)

  const processedArticle = processArticleLikeEntityForOwnPage({
    entity: fetchedArticle,
    validLanguageIds: globalData.languages.ids,
    validImages: fetchedImages,
  })

  const pageData: StaticData = {
    entity: {
      ...processedArticle,
      authors: validAuthors.entities,
      collections: validCollections.entities,
      languages: filterAndMapEntitiesById(
        mapEntityLanguageIds(processedArticle),
        globalData.languages.entities
      ),
      subjects: filterAndMapEntitiesById(
        fetchedArticle.subjectsIds,
        globalData.subjects.entities
      ),
      tags: validTags.entities,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
