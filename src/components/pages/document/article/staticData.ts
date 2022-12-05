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
  validateArticleLikeEntity,
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
import {
  processValidatedArticleLikeEntity,
  validateAuthorAsChild,
  validateCollectionAsChild,
  validateLanguage,
  validateSubjectAsChild,
  validateTagAsChild,
} from "^helpers/process-fetched-data"

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
  article: Article
  childEntities: {
    authors: Author[]
    collections: Collection[]
    images: Image[]
    languages: Language[]
    subjects: Subject[]
    tags: Tag[]
  }
}

// todo: should process sub entities as well? e.g. remove author translations without a name with length. Then need an updated, processed Type.
// todo: ...it's a bit confusing having to validate in different places. e.g. in authors component not sure if need to check if translation is valid.
// todo: maybe come back to after building out subjects, etc.

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

  const collections = article.collectionsIds.length
    ? await fetchCollections(article.collectionsIds)
    : []
  const validCollections = collections.filter((collection) =>
    validateCollectionAsChild(collection, validLanguageIds)
  )

  const subjects = article.subjectsIds.length
    ? await fetchSubjects(article.subjectsIds)
    : []
  const validSubjects = subjects.filter((subject) =>
    validateSubjectAsChild(subject, validLanguageIds)
  )

  const tags = article.tagsIds.length ? await fetchTags(article.tagsIds) : []
  const validTags = tags.filter((tag) => validateTagAsChild(tag))

  const processedArticle = processValidatedArticleLikeEntity({
    entity: article,
    validRelatedEntitiesIds: {
      languagesIds: validLanguageIds,
      authorsIds: mapIds(validAuthors),
      collectionsIds: mapIds(validCollections),
      subjectsIds: mapIds(validSubjects),
      tagsIds: mapIds(validTags),
    },
  })

  const processedTranslationLanguageIds = mapLanguageIds(
    processedArticle.translations
  )
  const processedTranslationLanguages = processedTranslationLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validLanguages.find((language) => language.id === languageId)!
  )

  const pageData: StaticData = {
    article: processedArticle,
    childEntities: {
      authors: validAuthors,
      collections: validCollections,
      images: articleImageIds.length ? await fetchImages(articleImageIds) : [],
      languages: processedTranslationLanguages,
      subjects: validSubjects,
      tags: validTags,
    },
  }

  return {
    props: pageData,
  }
}
