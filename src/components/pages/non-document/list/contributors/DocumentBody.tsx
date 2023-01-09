import tw from "twin.macro"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { sortEntitiesByLanguage } from "^helpers/manipulateEntity"
import { StaticData } from "./staticData"
import Summary from "./Summary"

const useProcessEntities = ({
  authors,
  sortLanguageId,
}: {
  authors: StaticData["authors"]["authors"]
  sortLanguageId: string | null
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const orderedByLanguage = sortEntitiesByLanguage(
    authors,
    sortLanguageId || siteLanguage.id
  )

  return orderedByLanguage
}

const DocumentBody = ({
  authors,
  sortLanguageId,
}: {
  authors: StaticData["authors"]["authors"]
  sortLanguageId: string | null
}) => {
  const processedEntities = useProcessEntities({
    authors,
    sortLanguageId: sortLanguageId,
  })

  return (
    <div css={[tw`pt-lg`]}>
      <div css={[tw`flex flex-col gap-md`]}>
        {processedEntities.map((author) => (
          <Summary
            author={author}
            sortLanguageId={sortLanguageId}
            key={author.id}
          />
        ))}
      </div>
    </div>
  )
}

export default DocumentBody
