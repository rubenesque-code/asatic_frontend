import { useState } from "react"
import { StaticData } from "../_types"
import DocumentBody from "./DocumentBody"
import DocumentHeader from "./DocumentHeader"

export type FilterLanguageId = "all" | Omit<string, "all">

const Body = ({
  articleLikeEntities,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
}) => {
  const [filterLanguageId, setFilterLanguageId] =
    useState<FilterLanguageId>("all")

  return (
    <div>
      <DocumentHeader />
      <DocumentBody />
    </div>
  )
}

export default Body
