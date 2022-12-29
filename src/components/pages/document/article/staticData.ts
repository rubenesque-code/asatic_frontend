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
  Image,
  Language,
  SanitisedArticle,
  SanitisedCollection,
  SanitisedSubject,
} from "^types/entities"

import { mapIds } from "^helpers/data"
import {
  getArticleLikeDocumentImageIds,
  mapEntitiesLanguageIds,
  processValidatedArticleLikeEntity,
  filterValidAuthorsAsChildren,
  filterValidCollections,
  filterValidTags,
  filterValidLanguages,
  filterValidArticleLikeEntities,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data"
import { filterArrAgainstControl } from "^helpers/general"
import {
  fetchAndValidateLanguages,
  fetchAndValidateSubjects,
} from "^helpers/static-data/global"

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
  const articleValidLanguages = filterValidLanguages(articleLanguages)

  const validArticles = filterValidArticleLikeEntities(
    publishedArticles,
    mapIds(articleValidLanguages)
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
    collections: SanitisedCollection[]
    images: Image[]
    languages: Language[]
    // subjects: SanitisedSubject[]
    // tags: Tag[]
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
  // - Global data: START ---

  const allValidSubjects = await fetchAndValidateSubjects()
  const allValidLanguages = await fetchAndValidateLanguages()
  const allValidLanguagesIds = mapIds(allValidLanguages)

  // - Global data: END ---

  // - Page specific data: START ---
  // * won't get to this point if article doesn't exist, so below workaround for fetching article is fine
  const fetchedArticle = await fetchArticle(params?.id || "")

  const articleChildrenIds = {
    languages: mapEntityLanguageIds(fetchedArticle),
    images: getArticleLikeDocumentImageIds(fetchedArticle.translations),
    authors: fetchedArticle.authorsIds,
    collections: fetchedArticle.collectionsIds,
    subjects: fetchedArticle.subjectsIds,
    tags: fetchedArticle.tagsIds,
  }

  const articleChildrenFetched = {
    images: !articleChildrenIds.images.length
      ? []
      : await fetchImages(articleChildrenIds.images),
    authors: !articleChildrenIds.authors.length
      ? []
      : await fetchAuthors(articleChildrenIds.authors),
    collections: !articleChildrenIds.collections.length
      ? []
      : await fetchCollections(articleChildrenIds.collections),
    subjects: !articleChildrenIds.subjects.length
      ? []
      : await fetchSubjects(articleChildrenIds.subjects),
    tags: !articleChildrenIds.tags.length
      ? []
      : await fetchTags(articleChildrenIds.tags),
  }

  const articleChildrenValidated = {
    languages: articleChildrenIds.languages
      .filter((articleLanguageId) =>
        allValidLanguagesIds.includes(articleLanguageId)
      )
      .map((articleLanguageId) =>
        allValidLanguages.find((language) => language.id === articleLanguageId)
      )
      .flatMap((language) => (language ? [language] : [])),
    authors: filterValidAuthorsAsChildren(
      articleChildrenFetched.authors,
      allValidLanguagesIds
    ),
    collections: filterValidCollections(
      articleChildrenFetched.collections,
      allValidLanguagesIds
    ),
    tags: filterValidTags(articleChildrenFetched.tags),
  }

  // should remove invalid image sections too (without corresponding fetched image)
  const processedArticle = processValidatedArticleLikeEntity({
    entity: fetchedArticle,
    validLanguageIds: allValidLanguagesIds,
    validRelatedEntitiesIds: {
      authorsIds: mapIds(articleChildrenValidated.authors),
      collectionsIds: mapIds(articleChildrenValidated.collections),
      subjectsIds: filterArrAgainstControl(
        mapIds(articleChildrenFetched.subjects),
        mapIds(allValidSubjects)
      ),
      tagsIds: mapIds(articleChildrenValidated.tags),
    },
  })
  // - Page specific data: END ---

  const pageData: StaticData = {
    article: processedArticle,
    childEntities: {
      ...articleChildrenValidated,
      images: articleChildrenFetched.images,
    },
    header: {
      subjects: allValidSubjects,
    },
  }

  return {
    props: pageData,
  }
}
