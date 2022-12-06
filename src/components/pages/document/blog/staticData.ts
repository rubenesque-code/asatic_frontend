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
  Author,
  Collection,
  Image,
  Language,
  SanitisedArticle,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import { mapIds, mapLanguageIds } from "^helpers/data"
import {
  getArticleLikeDocumentImageIds,
  mapEntitiesLanguageIds,
  validateArticleLikeEntity,
  processValidatedArticleLikeEntity,
  validateAuthorAsChild,
  validateCollectionAsChild,
  validateLanguage,
  validateSubjectAsChild,
  validateTagAsChild,
} from "^helpers/process-fetched-data"

export const getStaticPaths: GetStaticPaths = async () => {
  const publishedArticles = await fetchArticles()

  if (!publishedArticles.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

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
  article: SanitisedArticle
  childEntities: {
    authors: Author[]
    collections: Collection[]
    images: Image[]
    languages: Language[]
    subjects: SanitisedSubject[]
    tags: Tag[]
  }
  header: {
    subjects: SanitisedSubject[]
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
  console.log("articleLanguageIds:", articleLanguageIds)
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

  // todo: e.g. article.subjectIds doesn't necessarily map to a subject
  const allSubjects = await fetchSubjects()
  const allValidSubjects = allSubjects.filter((subject) =>
    validateSubjectAsChild(subject, validLanguageIds)
  )
  const validArticleSubjects = article.subjectsIds
    .map((subjectId) =>
      allValidSubjects.find((subject) => subject.id === subjectId)
    )
    .flatMap((subject) => (subject ? [subject] : []))

  const tags = article.tagsIds.length ? await fetchTags(article.tagsIds) : []
  const validTags = tags.filter((tag) => validateTagAsChild(tag))

  const processedArticle = processValidatedArticleLikeEntity({
    entity: article,
    validRelatedEntitiesIds: {
      languagesIds: validLanguageIds,
      authorsIds: mapIds(validAuthors),
      collectionsIds: mapIds(validCollections),
      subjectsIds: mapIds(validArticleSubjects),
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
      subjects: validArticleSubjects,
      tags: validTags,
    },
    header: {
      subjects: validArticleSubjects,
    },
  }

  return {
    props: pageData,
  }
}
