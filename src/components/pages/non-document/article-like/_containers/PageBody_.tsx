import { useEffect, useState } from "react"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { mapIds } from "^helpers/data"
import { LanguageSort_ } from "../../_containers"
import { StaticData } from "../_types"
import DocumentBody from "./DocumentBody_"
import DocumentHeader from "./DocumentHeader_"

export const PageBody_ = ({
  articleLikeEntities,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const [sortLanguageId, setSortLanguageId] = useState<string | null>(() => {
    if (articleLikeEntities.languages.length < 2) {
      return null
    }

    const languageIds = mapIds(articleLikeEntities.languages)
    const secondDefaultLanguageId =
      siteLanguage.id === "english" ? "tamil" : "english"

    return languageIds.includes(siteLanguage.id)
      ? siteLanguage.id
      : languageIds.includes(secondDefaultLanguageId)
      ? secondDefaultLanguageId
      : languageIds[0]
  })
  // console.log("sortLanguageId:", sortLanguageId)
  useEffect(() => {
    if (sortLanguageId === null || siteLanguage.id === sortLanguageId) {
      return
    }

    if (!mapIds(articleLikeEntities.languages).includes(siteLanguage.id)) {
      return
    }

    setSortLanguageId(siteLanguage.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteLanguage.id])

  return (
    <div>
      <DocumentHeader
        languageSort={
          sortLanguageId === null ? null : (
            <LanguageSort_
              currentSortLanguageId={sortLanguageId}
              entitiesLanguages={articleLikeEntities.languages}
              setSortLanguageId={setSortLanguageId}
            />
          )
        }
      />
      <DocumentBody
        articleLikeEntities={articleLikeEntities}
        sortLanguageId={sortLanguageId}
      />
    </div>
  )
}
