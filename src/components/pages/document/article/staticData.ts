import { GetStaticPaths, GetStaticProps } from 'next'
import { getArticleLikeDocumentImageIds } from '^helpers/articleLike'
import { mapLanguageIds } from '^helpers/data'

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
  Article,
  Author,
  Collection,
  Image,
  Language,
  Subject,
  Tag,
} from '^types/index'

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await fetchArticles()
  // process articles!
  const paths = articles.map((article) => ({
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
> = async (context) => {
  // * won't get to this point if article doesn't exist (true?), so below workaround for fetching article is fine
  const { params } = context

  const article = await fetchArticle(params?.id || '')
  const { authorsIds, collectionsIds, translations, subjectsIds, tagsIds } =
    article
  const languageIds = mapLanguageIds(translations)
  const imageIds = getArticleLikeDocumentImageIds(translations)

  const data = {
    article: await fetchArticle(params?.id || ''),
    authors: authorsIds.length ? await fetchAuthors(authorsIds) : [],
    collections: collectionsIds.length
      ? await fetchCollections(collectionsIds)
      : [],
    images: imageIds.length ? await fetchImages(imageIds) : [],
    languages: languageIds.length ? await fetchLanguages(languageIds) : [],
    subjects: subjectsIds.length ? await fetchSubjects(subjectsIds) : [],
    tags: tagsIds.length ? await fetchTags(tagsIds) : [],
  }

  return {
    props: {
      ...data,
    },
  }
}
