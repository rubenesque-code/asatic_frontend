import { GetStaticPaths, GetStaticProps } from 'next'

import {
  fetchArticle,
  fetchArticles,
  fetchAuthors,
  fetchCollections,
  fetchImages,
  fetchLanguages,
  fetchSubjects,
  fetchTags,
} from '^lib/firebase/firestore'

import {
  getArticleLikeDocumentImageIds,
  mapIds,
  mapLanguageIds,
  validateArticleLikeEntities,
  mapEntitiesLanguageIds,
  validateLanguages,
} from '^helpers/index'

import {
  Article,
  Author,
  Collection,
  Image,
  Language,
  Subject,
  Tag,
} from '^types/index'

export const getStaticPaths: GetStaticPaths = async () => {
  const allArticles = await fetchArticles()
  const articleLanguageIds = mapEntitiesLanguageIds(allArticles)
  const articleLanguages = await fetchLanguages(articleLanguageIds)

  const validLanguages = validateLanguages(articleLanguages)
  const validArticles = validateArticleLikeEntities(
    allArticles,
    mapIds(validLanguages)
  )

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
  article: Article
  authors: Author[]
  collections: Collection[]
  images: Image[]
  languages: Language[]
  subjects: Subject[]
  tags: Tag[]
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  // * won't get to this point if article doesn't exist (true?), so below workaround for fetching article is fine

  //Todo: process authors, collections, subjects, etc.

  const article = await fetchArticle(params?.id || '')
  // * article has been filtered in `getStaticPaths` above for invalid translations; languages will be valid.
  const articleLanguageIds = mapLanguageIds(article.translations)
  const articleImageIds = getArticleLikeDocumentImageIds(article.translations)

  const data = {
    article: await fetchArticle(params?.id || ''),
    authors: article.authorsIds.length
      ? await fetchAuthors(article.authorsIds)
      : [],
    collections: article.collectionsIds.length
      ? await fetchCollections(article.collectionsIds)
      : [],
    images: articleImageIds.length ? await fetchImages(articleImageIds) : [],
    languages: articleLanguageIds.length
      ? await fetchLanguages(articleLanguageIds)
      : [],
    subjects: article.subjectsIds.length
      ? await fetchSubjects(article.subjectsIds)
      : [],
    tags: article.tagsIds.length ? await fetchTags(article.tagsIds) : [],
  }

  return {
    props: {
      ...data,
    },
  }
}
