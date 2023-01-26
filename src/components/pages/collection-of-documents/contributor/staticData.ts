import { GetStaticPaths, GetStaticProps } from "next"

import { Language } from "^types/entities"
import { StaticDataWrapper } from "^types/staticData"

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

type PageData = {
  author: ReturnType<typeof processAuthorAsParent>
  languages: Language[]
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const validatedAuthor = globalData.validatedData.allAuthors.entities.find(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (author) => author.id === params!.id
  )!

  const validChildDocumentEntities = await fetchAndValidateDocumentEntities({
    articleIds: validatedAuthor.articlesIds,
    blogIds: validatedAuthor.blogsIds,
    recordedEventIds: validatedAuthor.recordedEventsIds,
    validLanguageIds: globalData.validatedData.allLanguages.ids,
  })

  const processedAuthor = processAuthorAsParent(validatedAuthor, {
    allAuthorsValidChildDocumentEntities: {
      articles: validChildDocumentEntities.articles.entities,
      blogs: validChildDocumentEntities.blogs.entities,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      recordedEvents: validChildDocumentEntities.recordedEvents!.entities,
    },
    validLanguageIds: globalData.validatedData.allLanguages.ids,
  })

  const authorLanguageIds = mapLanguageIds(processedAuthor.translations)
  const authorLanguages = authorLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.validatedData.allLanguages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    props: {
      globalData: {
        ...globalData.globalContextData,
        documentLanguageIds: authorLanguageIds,
      },
      pageData: {
        author: processedAuthor,
        languages: authorLanguages,
      },
    },
  }
}
