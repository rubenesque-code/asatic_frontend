import tw from "twin.macro"

import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { Language } from "^types/entities"
import { StaticData } from "./staticData"

import ArticleLikeEntity from "./child-summaries/ArticleLike"
import RecordedEvent from "./child-summaries/RecordedEvent"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"

// TODO: responsive child docs

const ChildDocuments = ({
  documentLanguage,
  childDocumentEntities,
}: {
  documentLanguage: Language
  childDocumentEntities: StaticData["collection"]["childDocumentEntities"]
}) => {
  return (
    <div css={[tw`pb-xl`]}>
      {childDocumentEntities.reverse().map((entity) => (
        <$SummaryContainer css={[tw`border-b`]} key={entity.id}>
          {entity.type === "article" || entity.type === "blog" ? (
            <ArticleLikeEntity
              articleLikeEntity={entity}
              parentCurrentLanguageId={documentLanguage.id}
            />
          ) : (
            <RecordedEvent
              parentCurrentLanguageId={documentLanguage.id}
              recordedEvent={entity as RecordedEventAsSummary}
            />
          )}
        </$SummaryContainer>
      ))}
    </div>
  )
}

export default ChildDocuments
