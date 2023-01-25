import { GetStaticProps } from "next"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateDocumentEntities } from "^helpers/fetch-and-validate/_helpers"

import { Language, SanitisedSubject } from "^types/entities"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { processAuthorsAsParents } from "^helpers/process-fetched-data/author/process"
import { mapLanguageIds } from "^helpers/data"
import { removeArrDuplicates } from "^helpers/general"

export type StaticData = {
  authors: {
    entities: ReturnType<typeof processAuthorsAsParents>
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validAuthors = await fetchAndValidateAuthors({
    ids: "all",
    validLanguageIds: globalData.languages.ids,
  })

  const childDocumentEntityIds = getUniqueChildEntitiesIds(
    validAuthors.entities,
    ["articlesIds", "blogsIds", "recordedEventsIds"]
  )
  const validChildDocumentEntities = await fetchAndValidateDocumentEntities({
    articleIds: childDocumentEntityIds.articlesIds,
    blogIds: childDocumentEntityIds.blogsIds,
    recordedEventIds: childDocumentEntityIds.recordedEventsIds,
    validLanguageIds: globalData.languages.ids,
  })

  const processedAuthors = processAuthorsAsParents(validAuthors.entities, {
    allAuthorsValidChildDocumentEntities: {
      articles: validChildDocumentEntities.articles.entities,
      blogs: validChildDocumentEntities.blogs.entities,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      recordedEvents: validChildDocumentEntities.recordedEvents!.entities,
    },
    validLanguageIds: globalData.languages.ids,
  })

  const authorLanguageIds = removeArrDuplicates(
    processedAuthors.flatMap((author) => mapLanguageIds(author))
  )
  const authorLanguages = authorLanguageIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.languages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    props: {
      authors: {
        entities: processedAuthors,
        languages: authorLanguages,
      },
      header: {
        subjects: globalData.subjects.entities,
      },
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}
