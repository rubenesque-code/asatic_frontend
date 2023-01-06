import { useState } from "react"
import { StaticData } from "../_types"
import DocumentBody from "./DocumentBody"
import DocumentHeader from "./DocumentHeader"

export type FilterLanguageId = "all" | Omit<string, "all">

const PageBody = ({
  articleLikeEntities,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
}) => {
  const [filterLanguageId, setFilterLanguageId] =
    useState<FilterLanguageId>("all")

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
