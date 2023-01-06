import tw from "twin.macro"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { sortEntitiesByLanguage } from "^helpers/manipulateEntity"
import { StaticData } from "./staticData"
import Summary from "./Summary"

const useProcessEntities = ({
  subjects: subjects,
  sortLanguageId,
}: {
  subjects: StaticData["subjects"]["subjects"]
  sortLanguageId: string | null
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const orderedByLanguage = sortEntitiesByLanguage(
    subjects,
    sortLanguageId || siteLanguage.id
  )

  return orderedByLanguage
}

const DocumentBody = ({
  subjects,
  sortLanguageId,
}: {
  subjects: StaticData["subjects"]["subjects"]
  sortLanguageId: string | null
}) => {
  const processedEntities = useProcessEntities({
    subjects,
    sortLanguageId: sortLanguageId,
  })

  return (
    <div css={[tw`pt-lg`]}>
      <div css={[tw`flex flex-col items-center gap-md`]}>
        {processedEntities.map((subject) => (
          <Summary
            subject={subject}
            sortLanguageId={sortLanguageId}
            key={subject.id}
          />
        ))}
      </div>
    </div>
  )
}

export default DocumentBody
