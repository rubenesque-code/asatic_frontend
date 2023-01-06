import { useEffect, useState } from "react"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { mapIds } from "^helpers/data"
import { LanguageSort_ } from "../_containers"
import DocumentBody from "./DocumentBody"
import DocumentHeader from "./DocumentHeader"
import { StaticData } from "./staticData"

const PageBody = ({ languages, subjects }: StaticData["subjects"]) => {
  const { siteLanguage } = useSiteLanguageContext()

  const [sortLanguageId, setSortLanguageId] = useState<string | null>(() => {
    if (languages.length < 2) {
      return null
    }

    const languageIds = mapIds(languages)
    const secondDefaultLanguageId =
      siteLanguage.id === "english" ? "tamil" : "english"

    return languageIds.includes(siteLanguage.id)
      ? siteLanguage.id
      : languageIds.includes(secondDefaultLanguageId)
      ? secondDefaultLanguageId
      : languageIds[0]
  })

  useEffect(() => {
    if (sortLanguageId === null || siteLanguage.id === sortLanguageId) {
      return
    }

    if (!mapIds(languages).includes(siteLanguage.id)) {
      return
    }

    setSortLanguageId(siteLanguage.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteLanguage.id])

  return (
    <div>
      <DocumentHeader
        languageSort={
          !sortLanguageId ? null : (
            <LanguageSort_
              currentSortLanguageId={sortLanguageId}
              entitiesLanguages={languages}
              setSortLanguageId={setSortLanguageId}
            />
          )
        }
      />
      <DocumentBody sortLanguageId={sortLanguageId} subjects={subjects} />
    </div>
  )
}

export default PageBody
