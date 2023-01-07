import { ReactElement } from "react"
import tw from "twin.macro"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import {
  sortEntitiesByDate,
  sortEntitiesByLanguage,
} from "^helpers/manipulateEntity"

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`

export function useProcessEntities<
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

// TODO: this works?
function guidGenerator() {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  )
}

export const DocumentBody_ = ({ entities }: { entities: ReactElement[] }) => {
  return (
    <div css={[tw`border-b`]}>
      <$SectionContent>
        <div css={[tw`lg:grid grid-cols-2`]}>
          {entities.map((entity, i) => (
            <div
              css={[
                i % 2 === 0 && tw`md:border-r`,
                entities.length % 2 === 1
                  ? i !== entities.length - 1
                    ? tw`border-b`
                    : tw`border-b-0`
                  : i !== entities.length - 1 && i !== entities.length - 2
                  ? tw`lg:border-b`
                  : tw`lg:border-b-0`,
              ]}
              key={guidGenerator()}
            >
              {entity}
            </div>
          ))}
        </div>
      </$SectionContent>
    </div>
  )
}
