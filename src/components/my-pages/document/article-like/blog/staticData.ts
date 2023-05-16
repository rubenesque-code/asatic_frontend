import { GetStaticPaths, GetStaticProps } from "next"

import { fetchBlog, fetchImages } from "^lib/firebase/firestore"

import { mapLanguageIds } from "^helpers/data"
import {
  getArticleLikeDocumentImageIds,
  processArticleLikeEntityForOwnPage,
} from "^helpers/process-fetched-data/article-like"
import { StaticData } from "../_types"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"

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

  const validAuthors = fetchedBlog.authorsIds.map(
    (authorId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allAuthors.entities.find(
        (author) => author.id === authorId
      )!
  )

  const imageIds = getArticleLikeDocumentImageIds(fetchedBlog.translations)
  const fetchedImages = await fetchImages(imageIds)

  const processedBlog = processArticleLikeEntityForOwnPage(fetchedBlog, {
    validLanguageIds: globalData.validatedData.allLanguages.ids,
    validImages: fetchedImages,
  })
  const blogLanguageIds = mapLanguageIds(processedBlog.translations)
  const blogLanguages = blogLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    props: {
      globalData: {
        ...globalData.globalContextData,
        documentLanguageIds: blogLanguageIds,
      },
      pageData: {
        articleLikeEntity: processedBlog,
        authors: validAuthors,
        languages: blogLanguages,
      },
    },
  }
}
