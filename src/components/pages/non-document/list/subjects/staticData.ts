import { GetStaticProps } from "next"

import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateSubjects } from "^helpers/fetch-and-validate/subjects"
import { processSubjectsAsLinks } from "^helpers/process-fetched-data/subject/process"
import { getEntitiesUniqueLanguageIds } from "^helpers/queryEntity"
import { Language, SanitisedSubject } from "^types/entities"

export type StaticData = {
  subjects: {
    subjects: {
      id: string
      translations: { id: string; title: string; languageId: string }[]
    }[]
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const validSubjects = await fetchAndValidateSubjects({
    ids: "all",
    validLanguageIds: globalData.languages.ids,
  })

  const processedSubjects = processSubjectsAsLinks(validSubjects.entities, {
    validLanguageIds: globalData.languages.ids,
  })

  const languageIds = getEntitiesUniqueLanguageIds(processedSubjects)

  return {
    props: {
      subjects: {
        subjects: processedSubjects,
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
