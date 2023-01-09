import { GetStaticProps } from "next"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { processAuthors } from "^helpers/process-fetched-data/author/process"
import { getEntitiesUniqueLanguageIds } from "^helpers/queryEntity"
import { Language, SanitisedSubject } from "^types/entities"

export type StaticData = {
  authors: {
    authors: ReturnType<typeof processAuthors>
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validAuthors = await fetchAndValidateAuthors({
    ids: "all",
    validLanguageIds: globalData.languages.ids,
  })

  const processedAuthors = processAuthors(validAuthors.entities, {
    validLanguageIds: globalData.languages.ids,
  })

  const languageIds = getEntitiesUniqueLanguageIds(processedAuthors)

  return {
    props: {
      authors: {
        authors: processedAuthors,
        languages: filterAndMapEntitiesById(
          languageIds,
          globalData.languages.entities
        ),
      },
      header: {
        subjects: globalData.subjects.entities,
      },
    },
  }
}
