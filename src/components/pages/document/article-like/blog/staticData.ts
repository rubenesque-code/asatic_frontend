import { GetStaticPaths, GetStaticProps } from "next"

import { fetchBlog, fetchImages } from "^lib/firebase/firestore"

import { filterAndMapEntitiesById } from "^helpers/data"
import {
  getArticleLikeDocumentImageIds,
  processArticleLikeEntityForOwnPage,
} from "^helpers/process-fetched-data/article-like"
import { mapEntityLanguageIds } from "^helpers/process-fetched-data/general"
import { StaticData } from "../_types"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateCollections } from "^helpers/fetch-and-validate/collections"
import { fetchAndValidateTags } from "^helpers/fetch-and-validate/tags"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedBlogs = await fetchAndValidateBlogs({ ids: "all" })

  if (!fetchedBlogs.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = fetchedBlogs.ids.map((id) => ({
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

  const fetchedBlog = await fetchBlog(params?.id || "")

  const validAuthors = await fetchAndValidateAuthors({
    ids: fetchedBlog.authorsIds,
    validLanguageIds: globalData.languages.ids,
  })
  const validCollections = await fetchAndValidateCollections({
    collectionIds: fetchedBlog.collectionsIds,
    collectionRelation: "child-of-document",
    validLanguageIds: globalData.languages.ids,
  })
  const validTags = await fetchAndValidateTags({
    ids: fetchedBlog.tagsIds,
  })

  const imageIds = getArticleLikeDocumentImageIds(fetchedBlog.translations)
  const fetchedImages = await fetchImages(imageIds)

  const processedBlog = processArticleLikeEntityForOwnPage({
    entity: fetchedBlog,
    validLanguageIds: globalData.languages.ids,
    validImages: fetchedImages,
  })

  const pageData: StaticData = {
    entity: {
      ...processedBlog,
      authors: validAuthors.entities,
      collections: validCollections.entities,
      languages: filterAndMapEntitiesById(
        mapEntityLanguageIds(processedBlog),
        globalData.languages.entities
      ),
      subjects: filterAndMapEntitiesById(
        fetchedBlog.subjectsIds,
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
