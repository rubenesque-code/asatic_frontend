import tw from "twin.macro"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { sortEntitiesByLanguage } from "^helpers/manipulateEntity"
import { StaticData } from "./staticData"
import Summary from "./Summary"

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`

const useProcessEntities = ({
  recordedEvents,
  sortLanguageId,
}: {
  recordedEvents: StaticData["recordedEvents"]["recordedEvents"]
  sortLanguageId: string | null
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const orderedByLanguage = sortEntitiesByLanguage(
    recordedEvents,
    sortLanguageId || siteLanguage.id
  )

  return orderedByLanguage
}

const DocumentBody = ({
  recordedEvents,
  sortLanguageId,
}: {
  recordedEvents: StaticData["recordedEvents"]["recordedEvents"]
  sortLanguageId: string | null
}) => {
  const processedEntities = useProcessEntities({
    recordedEvents,
    sortLanguageId: sortLanguageId,
  })

  return (
    <div css={[tw`border-b`]}>
      <$SectionContent>
        <div css={[tw`md:grid grid-cols-2`]}>
          {processedEntities.map((recordedEvent, i) => (
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
              key={recordedEvent.id}
            >
              <Summary
                recordedEvent={recordedEvent}
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
