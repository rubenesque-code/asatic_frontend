import { useEffect, useState } from "react"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const useSortByLanguage = (languageIds: string[]) => {
  const { siteLanguage } = useSiteLanguageContext()

  const [sortLanguageId, setSortLanguageId] = useState<string | null>(() => {
    if (languageIds.length < 2) {
      return null
    }

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

    if (!languageIds.includes(siteLanguage.id)) {
      return
    }

    setSortLanguageId(siteLanguage.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteLanguage.id])

  return { sortLanguageId, setSortLanguageId }
}

export default useSortByLanguage
