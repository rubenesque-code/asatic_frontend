import { useEffect, useState } from "react"
import { SiteLanguage, useSiteLanguageContext } from "^context/SiteLanguage"
import { mapIds } from "^helpers/data"

import { Language } from "^types/entities"

const initDocumentLanguage = (
  languages: Language[],
  siteLanguage: SiteLanguage
) => {
  if (mapIds(languages).includes(siteLanguage.id)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return languages.find((language) => language.id === siteLanguage.id)!
  }

  return languages[0]
}

export const useDetermineDocumentLanguage = (documentLanguages: Language[]) => {
  const { siteLanguage } = useSiteLanguageContext()

  const [documentLanguage, setDocumentLanguage] = useState(
    initDocumentLanguage(documentLanguages, siteLanguage)
  )

  useEffect(() => {
    // update document language on site language change
    if (siteLanguage.id === documentLanguage.id) {
      return
    }

    if (mapIds(documentLanguages).includes(siteLanguage.id)) {
      setDocumentLanguage(siteLanguage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteLanguage])

  return { documentLanguage, setDocumentLanguage }
}
