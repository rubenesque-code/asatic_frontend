import { GetStaticPaths, GetStaticProps } from "next"

import { fetchBlog, fetchBlogs } from "^lib/firebase/firestore"

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
import { StaticData } from "../_types"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedBlogs = await fetchBlogs()

  if (!fetchedBlogs.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const languages = await fetchAndValidateLanguages(
    mapEntitiesLanguageIds(fetchedBlogs)
  )

  const validBlogs = filterValidArticleLikeEntities(fetchedBlogs, languages.ids)

  if (!validBlogs.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validBlogs.map((blog) => ({
    params: {
      id: blog.id,
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

  const fetchedChildren = await fetchChildren(fetchedBlog)

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
      fetchedBlog.subjectsIds,
      globalData.subjects.entities
    ),
    languages: filterAndMapEntitiesById(
      mapEntityLanguageIds(fetchedBlog),
      globalData.languages.entities
    ),
  }

  const processedBlog = processArticleLikeEntityForOwnPage({
    entity: fetchedBlog,
    validLanguageIds: globalData.languages.ids,
    validImages: fetchedChildren.images,
  })

  const pageData: StaticData = {
    entity: { ...processedBlog, ...validatedChildren },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
