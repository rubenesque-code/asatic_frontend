import { StaticData } from "./staticData"

import { EntityLink_ } from "^entity-summary/_containers"
import { DateString_ } from "^components/pages/_containers"
import { $Title, $Date } from "^entity-summary/_styles/$summary"
import { siteTranslations } from "^constants/siteTranslations"
import tw from "twin.macro"

const Summary = ({
  entity,
  languageId,
}: {
  entity: StaticData["author"]["translations"][number]["documents"][number]
  languageId: string
}) => {
  return (
    <div css={[tw`border-b pb-md`]}>
      <h4
        css={[
          tw`capitalize  font-light text-gray-500 mb-xs`,
          languageId === "tamil"
            ? tw`font-sans-primary-tamil`
            : tw`font-sans-primary`,
        ]}
      >
        {
          siteTranslations[entity.type][
            languageId === "tamil" ? "tamil" : "english"
          ]
        }
      </h4>
      <$Date languageId={languageId}>
        <DateString_ engDateStr={entity.publishDate} languageId={languageId} />
      </$Date>
      <EntityLink_
        entityId={entity.id}
        documentLanguageId={languageId}
        routeKey={
          entity.type === "article"
            ? "articles"
            : entity.type === "blog"
            ? "blogs"
            : "recordedEvents"
        }
      >
        <$Title>{entity.title}</$Title>
      </EntityLink_>
    </div>
  )
}

export default Summary
