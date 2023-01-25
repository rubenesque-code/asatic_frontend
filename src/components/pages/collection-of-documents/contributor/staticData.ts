import { GetStaticPaths, GetStaticProps } from "next"

import { Language, SanitisedSubject } from "^types/entities"

import { fetchAuthor } from "^lib/firebase/firestore"
import { mapLanguageIds } from "^helpers/data"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { processAuthorAsParent } from "^helpers/process-fetched-data/author/process"
import { fetchAndValidateDocumentEntities } from "^helpers/fetch-and-validate/_helpers"

export const getStaticPaths: GetStaticPaths = async () => {
  const validAuthors = await fetchAndValidateAuthors({ ids: "all" })

  if (!validAuthors.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = validAuthors.ids.map((id) => ({
    params: {
      id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export type StaticData = {
  author: ReturnType<typeof processAuthorAsParent> & {
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}
export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fetchedAuthor = await fetchAuthor(params!.id)

  const validChildDocumentEntities = await fetchAndValidateDocumentEntities({
    articleIds: fetchedAuthor.articlesIds,
    blogIds: fetchedAuthor.blogsIds,
    recordedEventIds: fetchedAuthor.recordedEventsIds,
    validLanguageIds: globalData.languages.ids,
  })

  const processedAuthor = processAuthorAsParent(fetchedAuthor, {
    allAuthorsValidChildDocumentEntities: {
      articles: validChildDocumentEntities.articles.entities,
      blogs: validChildDocumentEntities.blogs.entities,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      recordedEvents: validChildDocumentEntities.recordedEvents!.entities,
    },
    validLanguageIds: globalData.languages.ids,
  })

  const authorLanguageIds = mapLanguageIds(processedAuthor.translations)
  const authorLanguages = authorLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.languages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  const pageData: StaticData = {
    author: {
      ...processedAuthor,
      languages: authorLanguages,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
    isMultipleAuthors: globalData.isMultipleAuthors,
  }

  return {
    props: pageData,
  }
}
