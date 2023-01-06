import tw from "twin.macro"

import {
  sortEntitiesByDate,
  sortEntitiesByLanguage,
} from "^helpers/manipulateEntity"
import { StaticData } from "../_types"
import Summary from "./Summary"

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`

const useProcessEntities = ({
  articleLikeEntities,
  filterLanguageId,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
  filterLanguageId: string
}) => {
  const orderedByDate = sortEntitiesByDate(articleLikeEntities.entities)

  const orderedByFilterLanguage = sortEntitiesByLanguage(
    orderedByDate,
    filterLanguageId as string
  )

  return orderedByFilterLanguage
}

const DocumentBody = ({
  articleLikeEntities,
  filterLanguageId,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
  filterLanguageId: string
}) => {
  const processedEntities = useProcessEntities({
    articleLikeEntities,
    filterLanguageId,
  })

  return (
    <div css={[tw`border-b`]}>
      <$SectionContent>
        <div css={[tw`lg:grid grid-cols-2`]}>
          {processedEntities.map((articleLikeEntity, i) => (
            <div
              css={[
                i % 2 === 0 && tw`lg:border-r`,
                i !== processedEntities.length - 1
                  ? tw`border-b`
                  : tw`border-b-0`,
                i !== processedEntities.length - 1 &&
                i !== processedEntities.length - 2
                  ? tw`lg:border-b`
                  : tw`lg:border-b-0`,
              ]}
              key={articleLikeEntity.id}
            >
              <Summary
                articleLikeEntity={articleLikeEntity}
                filterLanguageId={filterLanguageId}
              />
            </div>
          ))}
        </div>
      </$SectionContent>
    </div>
  )
}

export default DocumentBody
