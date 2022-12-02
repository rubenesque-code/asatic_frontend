import { GetStaticPaths, GetStaticProps } from "next"

import {
  fetchArticle,
  fetchArticles,
  fetchAuthors,
  fetchCollections,
  fetchImages,
  fetchLanguages,
  fetchSubjects,
  fetchTags,
} from "^lib/firebase/firestore"

import {
  getArticleLikeDocumentImageIds,
  mapIds,
  mapLanguageIds,
  mapEntitiesLanguageIds,
  validateLanguage,
  validateArticleLikeEntity,
  processValidatedArticleLikeEntity,
} from "^helpers/index"

import {
  Article,
  Author,
  Collection,
  Image,
  Language,
  Subject,
  Tag,
} from "^types/entities"
import { validateAuthorAsChild } from "^helpers/process-fetched-data/author"

export const getStaticPaths: GetStaticPaths = async () => {
  const publishedArticles = await fetchArticles()

  const articleLanguageIds = mapEntitiesLanguageIds(publishedArticles)
  const articleLanguages = await fetchLanguages(articleLanguageIds)

  const validLanguages = articleLanguages.filter((language) =>
    validateLanguage(language)
  )

  const validArticles = publishedArticles.filter((article) =>
    validateArticleLikeEntity(article, mapIds(validLanguages))
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
  article: {
    data: Article
    subEntities: {
      authors: Author[]
      collections: Collection[]
      images: Image[]
      languages: Language[]
      subjects: Subject[]
      tags: Tag[]
    }
  }
  subjects: Subject[]
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  // * won't get to this point if article doesn't exist (true?), so below workaround for fetching article is fine
  const article = await fetchArticle(params?.id || "")

  const articleLanguageIds = mapLanguageIds(article.translations)
  const articleLanguages = await fetchLanguages(articleLanguageIds)
  const validLanguages = articleLanguages.filter((language) =>
    validateLanguage(language)
  )
  const validLanguageIds = mapIds(validLanguages)

  const articleImageIds = getArticleLikeDocumentImageIds(article.translations)

  const authors = article.authorsIds.length
    ? await fetchAuthors(article.authorsIds)
    : []
  const validAuthors = authors.filter((author) =>
    validateAuthorAsChild(author, validLanguageIds)
  )

  const processedArticle = processValidatedArticleLikeEntity({
    entity: article,
    validRelatedEntitiesIds: {
      authors: validAuthors,
      collections,
    },
  })

  const data = {
    article: {
      data: await fetchArticle(params?.id || ""),
      subEntities: {
        authors: article.authorsIds.length
          ? await fetchAuthors(article.authorsIds)
          : [],
        collections: article.collectionsIds.length
          ? await fetchCollections(article.collectionsIds)
          : [],
        images: articleImageIds.length
          ? await fetchImages(articleImageIds)
          : [],
        languages: articleLanguageIds.length
          ? await fetchLanguages(articleLanguageIds)
          : [],
        subjects: article.subjectsIds.length
          ? await fetchSubjects(article.subjectsIds)
          : [],
        tags: article.tagsIds.length ? await fetchTags(article.tagsIds) : [],
      },
    },
    subjects: await fetchSubjects(),
  }

  return {
    props: {
      ...data,
    },
  }
}
