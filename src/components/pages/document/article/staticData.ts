import { GetStaticPaths, GetStaticProps } from "next"

import {
  fetchArticle,
  fetchArticles,
  fetchAuthors,
  fetchBlogs,
  fetchCollections,
  fetchImages,
  fetchLanguages,
  fetchRecordedEvents,
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
  mapEntityLanguageIds,
  filterValidLanguages,
  filterValidAuthorsAsChildren,
  filterValidCollectionsAsChildren,
} from "^helpers/process-fetched-data"
import { removeArrDuplicates } from "^helpers/general"

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

// todo: what happened if image not returned? article.translations -> imageIds will look for image in images arr. Should strip out.
// * is there a difference between validating as child or as own entity?

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  // * won't get to this point if article doesn't exist, so below workaround for fetching article is fine
  const fetchedArticle = await fetchArticle(params?.id || "")

  const languages = {
    article: {
      fetched: await fetchLanguages(mapEntityLanguageIds(fetchedArticle)),
      valid() {
        return filterValidLanguages(this.fetched)
      },
      validIds() {
        return mapIds(this.valid())
      },
    },
  }

  const images = {
    article: {
      ids: getArticleLikeDocumentImageIds(fetchedArticle.translations),
      async fetched() {
        return !this.ids.length ? [] : await fetchImages(this.ids)
      },
    },
  }

  const authors = {
    article: {
      ids: fetchedArticle.authorsIds,
      async fetched() {
        return !this.ids.length ? [] : await fetchAuthors(this.ids)
      },
      async valid() {
        return filterValidAuthorsAsChildren(
          await this.fetched(),
          languages.article.validIds()
        )
      },
      async validIds() {
        return mapIds(await this.valid())
      },
    },
  }

  const collections = {
    article: {
      ids: fetchedArticle.collectionsIds,
      async fetched() {
        return !this.ids.length ? [] : await fetchCollections(this.ids)
      },
      async valid() {
        return filterValidCollectionsAsChildren(
          await this.fetched(),
          languages.article.validIds()
        )
      },
      async validIds() {
        return mapIds(await this.valid())
      },
    },
  }

  //
  const subjects = {
    all: {
      fetched: await fetchSubjects(),
      async languages() {
        const ids = removeArrDuplicates(
          this.fetched.flatMap((subject) =>
            subject.translations.flatMap((t) => t.languageId)
          )
        )
        const fetched = await fetchLanguages(ids)
        const valid = filterValidLanguages(fetched)

        return { valid, validIds: mapIds(valid) }
      },
      async articles() {
        const ids = removeArrDuplicates(
          this.fetched.flatMap((subject) => subject.articlesIds)
        )
        const fetched = await fetchArticles(ids)

        const validLanguagesIds = (await this.languages()).validIds

        const valid = fetched.filter(async (article) =>
          validateArticleLikeEntity(article, validLanguagesIds)
        )

        return {
          valid,
          validIds: mapIds(valid),
        }
      },
      async blogs() {
        const ids = removeArrDuplicates(
          this.fetched.flatMap((subject) => subject.blogsIds)
        )
        const fetched = await fetchBlogs(ids)

        const validLanguagesIds = (await this.languages()).validIds

        const valid = fetched.filter(async (blog) =>
          validateArticleLikeEntity(blog, validLanguagesIds)
        )

        return {
          valid,
          validIds: mapIds(valid),
        }
      },
      async collections() {
        const ids = removeArrDuplicates(
          this.fetched.flatMap((subject) => subject.collectionsIds)
        )
        const fetched = await fetchCollections(ids)

        const validLanguagesIds = (await this.languages()).validIds

        const valid = fetched.filter(async (blog) =>
          validateCollectionAsChild(blog, validLanguagesIds)
        )

        return {
          valid,
          validIds: mapIds(valid),
        }
      },
      async recordedEvents() {
        const ids = removeArrDuplicates(
          this.fetched.flatMap((subject) => subject.recordedEventsIds)
        )
        const fetched = await fetchRecordedEvents(ids)

        const validLanguagesIds = (await this.languages()).validIds

        const valid = fetched.filter(async (blog) =>
          validrecord(blog, validLanguagesIds)
        )

        return {
          valid,
          validIds: mapIds(valid),
        }
      },
    },
  }

  // todo: e.g. article.subjectIds doesn't necessarily map to a subject

  /*   const tags = fetchedArticle.tagsIds.length
    ? await fetchTags(fetchedArticle.tagsIds)
    : []
  const validTags = tags.filter((tag) => validateTagAsChild(tag)) */

  const processedArticle = processValidatedArticleLikeEntity({
    entity: fetchedArticle,
    validRelatedEntitiesIds: {
      languagesIds: languages.article.validIds(),
      authorsIds: await authors.article.validIds(),
      collectionsIds: await collections.article.validIds(),
      subjectsIds: mapIds(validArticleSubjects),
      // tagsIds: mapIds(validTags),
    },
  })

  const processedTranslationLanguageIds = mapLanguageIds(
    processedArticle.translations
  )
  const processedTranslationLanguages = processedTranslationLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      languages.article.valid().find((language) => language.id === languageId)!
  )

  const pageData: StaticData = {
    article: processedArticle,
    childEntities: {
      authors: await authors.article.valid(),
      collections: await collections.article.valid(),
      images: await images.article.fetched(),
      languages: processedTranslationLanguages,
      // subjects: validArticleSubjects,
      // tags: validTags,
    },
    header: {
      subjects: validArticleSubjects,
    },
  }

  return {
    props: pageData,
  }
}
