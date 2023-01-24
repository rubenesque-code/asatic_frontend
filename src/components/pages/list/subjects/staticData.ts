import { GetStaticProps } from "next"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { removeArrDuplicates } from "^helpers/general"
import { processSubjectsAsLinks } from "^helpers/process-fetched-data/subject/process"

import { Language, SanitisedSubject } from "^types/entities"

export type StaticData = {
  subjects: {
    entities: ReturnType<typeof processSubjectsAsLinks>
    languages: Language[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
  isMultipleAuthors: boolean
}

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const processedSubjects = processSubjectsAsLinks(globalData.subjects.entities)

  const subjectLanguagesIds = removeArrDuplicates(
    processedSubjects.flatMap((subject) => subject.languageId)
  )
  const subjectLanguages = subjectLanguagesIds.map(
    (languageId) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      globalData.languages.entities.find(
        (validLanguage) => validLanguage.id === languageId
      )!
  )

  return {
    props: {
      subjects: { entities: processedSubjects, languages: subjectLanguages },
      header: {
        subjects: globalData.subjects.entities,
      },
      isMultipleAuthors: globalData.isMultipleAuthors,
    },
  }
}
