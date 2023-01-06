import tw from "twin.macro"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import {
  sortEntitiesByDate,
  sortEntitiesByLanguage,
} from "^helpers/manipulateEntity"
import { StaticData } from "../_types"
import Summary_ from "./Summary_"

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`

function useProcessEntities<
  TEntity extends { translations: TTranslation[]; publishDate: string },
  TTranslation extends { languageId: string }
>({
  entities,
  sortLanguageId,
}: {
  entities: TEntity[]
  sortLanguageId: string | null
}) {
  const orderedByDate = sortEntitiesByDate(entities)

  const { siteLanguage } = useSiteLanguageContext()

  const orderedByLanguage = sortEntitiesByLanguage(
    orderedByDate,
    sortLanguageId || siteLanguage.id
  )

  return orderedByLanguage
}

const DocumentBody = ({
  articleLikeEntities,
  sortLanguageId,
}: {
  articleLikeEntities: StaticData["articleLikeEntities"]
  sortLanguageId: string | null
}) => {
  const processedEntities = useProcessEntities({
    entities: articleLikeEntities.entities,
    sortLanguageId: sortLanguageId,
  })

  return (
    <div css={[tw`border-b`]}>
      <$SectionContent>
        <div css={[tw`lg:grid grid-cols-2`]}>
          {processedEntities.map((articleLikeEntity, i) => (
            <div
              css={[
                i % 2 === 0 && tw`md:border-r`,
                processedEntities.length % 2 === 1
                  ? i !== processedEntities.length - 1
                    ? tw`border-b`
                    : tw`border-b-0`
                  : i !== processedEntities.length - 1 &&
                    i !== processedEntities.length - 2
                  ? tw`lg:border-b`
                  : tw`lg:border-b-0`,
              ]}
              key={articleLikeEntity.id}
            >
              <Summary_
                articleLikeEntity={articleLikeEntity}
                sortLanguageId={sortLanguageId}
              />
            </div>
          ))}
        </div>
      </$SectionContent>
    </div>
  )
}

export default DocumentBody
