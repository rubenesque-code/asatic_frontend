import { filterEntitiesWithLanguage } from "^helpers/filter-entities"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { StaticData } from "../_types"
import { FilterLanguageId } from "./Body"

const useProcess = ({
  articleLikeEntities,
  filterLanguageId,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
  filterLanguageId: FilterLanguageId
}) => {
  const ordered = sortEntitiesByDate(articleLikeEntities)

  if (filterLanguageId === "all") {
    return ordered
  }

  const filtered = filterEntitiesWithLanguage(
    ordered,
    filterLanguageId as string
  )

  return filtered
}

const DocumentBody = ({
  articleLikeEntities,
  filterLanguageId,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
  filterLanguageId: FilterLanguageId
}) => {
  const processedEntities = useProcess({
    articleLikeEntities,
    filterLanguageId,
  })

  return <div>Body</div>
}

export default DocumentBody
