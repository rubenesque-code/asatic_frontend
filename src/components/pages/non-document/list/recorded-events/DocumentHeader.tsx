import { ReactElement } from "react"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { $DocumentHeader_ } from "../_presentation"

const DocumentHeader = ({
  languageSort,
}: {
  languageSort: ReactElement | null
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const title = siteTranslations.recordedEvents[siteLanguage.id]

  return <$DocumentHeader_ languageSort={languageSort} title={title} />
}

export default DocumentHeader
