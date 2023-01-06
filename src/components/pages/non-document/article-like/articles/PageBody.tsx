import { useState } from "react"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { StaticData } from "../_types"
import DocumentBody from "./DocumentBody"
import DocumentHeader from "./DocumentHeader"

const PageBody = ({
  articleLikeEntities,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const [filterLanguageId, setFilterLanguageId] = useState<string>(
    siteLanguage.id
  )

  return (
    <div>
      <DocumentHeader
        filterLanguages={articleLikeEntities.languages}
        currentFilterLanguageId={filterLanguageId}
        setFilterLanguageId={setFilterLanguageId}
      />
      <DocumentBody
        articleLikeEntities={articleLikeEntities}
        filterLanguageId={filterLanguageId}
      />
    </div>
  )
}

export default PageBody
