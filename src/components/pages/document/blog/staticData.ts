import { GetStaticPaths, GetStaticProps } from "next"

import {
  fetchAuthors,
  fetchBlog,
  fetchBlogs,
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
  SanitisedBlog,
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
  const publishedBlogs = await fetchBlogs()

  if (!publishedBlogs.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const blogLanguageIds = mapEntitiesLanguageIds(publishedBlogs)
  const blogLanguages = await fetchLanguages(blogLanguageIds)
  const blogValidLanguages = filterValidLanguages(blogLanguages)

  const validBlogs = filterValidArticleLikeEntities(
    publishedBlogs,
    mapIds(blogValidLanguages)
  )

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

export type StaticData = {
  blog: SanitisedBlog
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
  const fetchedBlog = await fetchBlog(params?.id || "")

  const blogChildrenIds = {
    languages: mapEntityLanguageIds(fetchedBlog),
    images: getArticleLikeDocumentImageIds(fetchedBlog.translations),
    authors: fetchedBlog.authorsIds,
    collections: fetchedBlog.collectionsIds,
    subjects: fetchedBlog.subjectsIds,
    tags: fetchedBlog.tagsIds,
  }

  const blogChildrenFetched = {
    images: !blogChildrenIds.images.length
      ? []
      : await fetchImages(blogChildrenIds.images),
    authors: !blogChildrenIds.authors.length
      ? []
      : await fetchAuthors(blogChildrenIds.authors),
    collections: !blogChildrenIds.collections.length
      ? []
      : await fetchCollections(blogChildrenIds.collections),
    subjects: !blogChildrenIds.subjects.length
      ? []
      : await fetchSubjects(blogChildrenIds.subjects),
    tags: !blogChildrenIds.tags.length
      ? []
      : await fetchTags(blogChildrenIds.tags),
  }

  const blogChildrenValidated = {
    languages: blogChildrenIds.languages
      .filter((blogLanguageId) => allValidLanguagesIds.includes(blogLanguageId))
      .map((blogLanguageId) =>
        allValidLanguages.find((language) => language.id === blogLanguageId)
      )
      .flatMap((language) => (language ? [language] : [])),
    authors: filterValidAuthorsAsChildren(
      blogChildrenFetched.authors,
      allValidLanguagesIds
    ),
    collections: filterValidCollections(
      blogChildrenFetched.collections,
      allValidLanguagesIds
    ),
    tags: filterValidTags(blogChildrenFetched.tags),
  }

  // should remove invalid image sections too (without corresponding fetched image)
  const processedBlog = processValidatedArticleLikeEntity({
    entity: fetchedBlog,
    validLanguageIds: allValidLanguagesIds,
    validRelatedEntitiesIds: {
      authorsIds: mapIds(blogChildrenValidated.authors),
      collectionsIds: mapIds(blogChildrenValidated.collections),
      subjectsIds: filterArrAgainstControl(
        mapIds(blogChildrenFetched.subjects),
        mapIds(allValidSubjects)
      ),
      tagsIds: mapIds(blogChildrenValidated.tags),
    },
  })
  // - Page specific data: END ---

  const pageData: StaticData = {
    blog: processedBlog,
    childEntities: {
      ...blogChildrenValidated,
      images: blogChildrenFetched.images,
    },
    header: {
      subjects: allValidSubjects,
    },
  }

  return {
    props: pageData,
  }
}
