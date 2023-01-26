import { GetStaticProps } from "next"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateDocumentEntities } from "^helpers/fetch-and-validate/_helpers"

import { Language } from "^types/entities"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { processAuthorsAsParents } from "^helpers/process-fetched-data/author/process"
import { mapLanguageIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"
import { StaticDataWrapper } from "^types/staticData"

type PageData = {
  authors: ReturnType<typeof processAuthorsAsParents>
  languages: Language[]
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validAuthors = globalData.validatedData.allAuthors.entities

  const childDocumentEntityIds = getUniqueChildEntitiesIds(validAuthors, [
    "articlesIds",
    "blogsIds",
    "recordedEventsIds",
  ])
  const validChildDocumentEntities = await fetchAndValidateDocumentEntities({
    articleIds: childDocumentEntityIds.articlesIds,
    blogIds: childDocumentEntityIds.blogsIds,
    recordedEventIds: childDocumentEntityIds.recordedEventsIds,
    validLanguageIds: globalData.validatedData.allLanguages.ids,
  })

  const processedAuthors = processAuthorsAsParents(validAuthors, {
    allAuthorsValidChildDocumentEntities: {
      articles: validChildDocumentEntities.articles.entities,
      blogs: validChildDocumentEntities.blogs.entities,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      recordedEvents: validChildDocumentEntities.recordedEvents!.entities,
    },
    validLanguageIds: globalData.validatedData.allLanguages.ids,
  })

  const authorLanguageIds = removeArrDuplicates(
    processedAuthors.flatMap((author) => mapLanguageIds(author.translations))
  )
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
      pageData: { authors: processedAuthors, languages: authorLanguages },
    },
  }
}
