import tw from "twin.macro"

import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { Language } from "^types/entities"
import { StaticData } from "./staticData"

import ArticleLikeEntity from "./child-summaries/ArticleLike"
import RecordedEvent from "./child-summaries/RecordedEvent"
import { $ChildSummaryContainer } from "^components/pages/_collections/DocumentSummary"

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
      {childDocumentEntities.map((entity) => (
        <$ChildSummaryContainer css={[tw`border-b`]} key={entity.id}>
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
        </$ChildSummaryContainer>
      ))}
    </div>
  )
}

export default ChildDocuments
