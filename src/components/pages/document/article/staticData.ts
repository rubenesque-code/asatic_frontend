import { GetStaticPaths, GetStaticProps } from "next"

import {
  fetchArticle,
  fetchArticles,
  fetchImages,
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
  filterValidArticleLikeEntities,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data"
import { filterArrAgainstControl } from "^helpers/general"
import { fetchAndValidateGlobalData } from "^helpers/static-data/global"
import { fetchAndValidateLanguages } from "^helpers/static-data/languages"
import { fetchChildren, validateChildren } from "^helpers/static-data/helpers"

export const getStaticPaths: GetStaticPaths = async () => {
  const fetchedArticles = await fetchArticles()

  if (!fetchedArticles.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const languages = await fetchAndValidateLanguages(
    mapEntitiesLanguageIds(fetchedArticles)
  )

  const validArticles = filterValidArticleLikeEntities(
    fetchedArticles,
    languages.ids
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
  const globalData = await fetchAndValidateGlobalData()

  // - Page specific data: START ---
  // * won't get to this point if article doesn't exist, so below workaround for fetching article is fine
  const fetchedArticle = await fetchArticle(params?.id || "")

  const fetchedChildren = await fetchChildren(fetchedArticle)

  const validatedChildren = validateChildren(
    {
      authors: fetchedChildren.authors,
      collections: fetchedChildren.collections,
      tags: fetchedChildren.tags,
    },
    globalData.languages.ids
  )

  const articleChildrenIds = {
    languages: mapEntityLanguageIds(fetchedArticle),
  }

  const articleChildrenValidated = {
    languages: articleChildrenIds.languages
      .filter((articleLanguageId) =>
        globalData.languages.ids.includes(articleLanguageId)
      )
      .map((articleLanguageId) =>
        globalData.languages.entities.find(
          (language) => language.id === articleLanguageId
        )
      )
      .flatMap((language) => (language ? [language] : [])),
    authors: filterValidAuthorsAsChildren(
      fetchedChildren.authors,
      globalData.languages.ids
    ),
    collections: filterValidCollections(
      fetchedChildren.collections,
      globalData.languages.ids
    ),
    tags: filterValidTags(fetchedChildren.tags),
  }

  // should remove invalid image sections too (without corresponding fetched image)
  const processedArticle = processValidatedArticleLikeEntity({
    entity: fetchedArticle,
    validLanguageIds: globalData.languages.ids,
    validRelatedEntitiesIds: {
      authorsIds: mapIds(articleChildrenValidated.authors),
      collectionsIds: mapIds(articleChildrenValidated.collections),
      subjectsIds: filterArrAgainstControl(
        mapIds(fetchedChildren.subjects),
        globalData.subjects.ids
      ),
      tagsIds: mapIds(articleChildrenValidated.tags),
    },
  })
  // - Page specific data: END ---

  const pageData: StaticData = {
    article: processedArticle,
    childEntities: {
      ...articleChildrenValidated,
      images: fetchedChildren.images,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
