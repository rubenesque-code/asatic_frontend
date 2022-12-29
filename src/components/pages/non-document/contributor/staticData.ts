import { GetStaticPaths, GetStaticProps } from "next"
import { mapIds } from "^helpers/data"
import {
  filterValidArticleLikeEntities,
  mapEntityLanguageIds,
  processValidatedAuthor,
} from "^helpers/process-fetched-data"
import { filterValidRecordedEvents } from "^helpers/process-fetched-data/recordedEvent"
import { fetchAndValidateAuthors } from "^helpers/static-data/authors"
import {
  fetchAndValidateLanguages,
  fetchAndValidateSubjects,
} from "^helpers/static-data/global"
import {
  fetchArticles,
  fetchAuthor,
  fetchBlogs,
  fetchRecordedEvents,
} from "^lib/firebase/firestore"
import {
  Author,
  Language,
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
  SanitisedSubject,
} from "^types/entities"

export const getStaticPaths: GetStaticPaths = async () => {
  const authors = await fetchAndValidateAuthors()

  if (!authors.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = authors.map((author) => ({
    params: {
      id: author.id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export type StaticData = {
  author: Author
  childEntities: {
    languages: Language[]
    articles: SanitisedArticle[]
    blogs: SanitisedBlog[]
    recordedEvents: SanitisedRecordedEvent[]
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
  // * won't get to this point if article doesn't exist, so below workaround for fetching article is fine
  const fetchedAuthor = await fetchAuthor(params?.id || "")

  const authorChildrenIds = {
    languages: mapEntityLanguageIds(fetchedAuthor),
    articles: fetchedAuthor.articlesIds,
    blogs: fetchedAuthor.blogsIds,
    recordedEvents: fetchedAuthor.recordedEventsIds,
  }

  const authorChildrenFetched = {
    articles: !authorChildrenIds.articles.length
      ? []
      : await fetchArticles(authorChildrenIds.articles),
    blogs: !authorChildrenIds.blogs.length
      ? []
      : await fetchBlogs(authorChildrenIds.blogs),
    recordedEvents: !authorChildrenIds.recordedEvents.length
      ? []
      : await fetchRecordedEvents(authorChildrenIds.recordedEvents),
  }

  const authorChildrenValidated = {
    articles: filterValidArticleLikeEntities(
      authorChildrenFetched.articles,
      allValidLanguagesIds
    ),
    blogs: filterValidArticleLikeEntities(
      authorChildrenFetched.blogs,
      allValidLanguagesIds
    ),
    recordedEvents: filterValidRecordedEvents(
      authorChildrenFetched.recordedEvents,
      allValidLanguagesIds
    ),
    languages: authorChildrenIds.languages
      .filter((authorLanguageId) =>
        allValidLanguagesIds.includes(authorLanguageId)
      )
      .map((authorLanguageId) =>
        allValidLanguages.find((language) => language.id === authorLanguageId)
      )
      .flatMap((language) => (language ? [language] : [])),
  }

  const processedAuthor = processValidatedAuthor({
    entity: fetchedAuthor,
    validLanguageIds: allValidLanguagesIds,
    validRelatedEntitiesIds: {
      articlesIds: mapIds(authorChildrenValidated.articles),
      blogsIds: mapIds(authorChildrenValidated.blogs),
      recordedEventsIds: mapIds(authorChildrenValidated.recordedEvents),
    },
  })
  // - Page specific data: END ---

  const pageData: StaticData = {
    author: processedAuthor,
    childEntities: authorChildrenValidated,
    header: {
      subjects: allValidSubjects,
    },
  }

  return {
    props: pageData,
  }
}
