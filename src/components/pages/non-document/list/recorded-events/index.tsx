import useSortByLanguage from "^hooks/useSortByLanguage"

import { StaticData } from "./staticData"

import { mapIds } from "^helpers/data"

import Header from "^components/header"
import { $PageLayout } from "../_presentation"
import DocumentBody_ from "./DocumentBody"
import DocumentHeader from "./DocumentHeader"
import { LanguageSort_ } from "../_containers"

const RecordedEventsPage = ({ recordedEvents, header }: StaticData) => {
  const { sortLanguageId, setSortLanguageId } = useSortByLanguage(
    mapIds(recordedEvents.languages)
  )

  return (
    <$PageLayout header={<Header {...header} />}>
      <DocumentHeader
        languageSort={
          !sortLanguageId ? null : (
            <LanguageSort_
              currentSortLanguageId={sortLanguageId}
              entitiesLanguages={recordedEvents.languages}
              setSortLanguageId={setSortLanguageId}
            />
          )
        }
      />
      <DocumentBody_
        sortLanguageId={sortLanguageId}
        recordedEvents={recordedEvents.recordedEvents}
      />
    </$PageLayout>
  )
}

export default RecordedEventsPage
