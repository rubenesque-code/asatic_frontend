import tw from "twin.macro"

import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { StaticData } from "./staticData"

import ArticleLikeEntity from "./child-summaries/ArticleLike"
import RecordedEvent from "./child-summaries/RecordedEvent"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"

const ChildDocuments = ({
  collection,
}: {
  collection: StaticData["pageData"]["collection"]
}) => {
  console.log("collection:", collection)
  return (
    <div css={[tw`pb-xl`]}>
      {collection.childDocumentEntities.map((entity) => (
        <$SummaryContainer css={[tw`border-b`]} key={entity.id}>
          {entity.type === "article" || entity.type === "blog" ? (
            <ArticleLikeEntity
              articleLikeEntity={entity}
              parentCurrentLanguageId={collection.languageId}
            />
          ) : (
            <RecordedEvent
              parentCurrentLanguageId={collection.languageId}
              recordedEvent={entity as RecordedEventAsSummary}
            />
          )}
        </$SummaryContainer>
      ))}
    </div>
  )
}

export default ChildDocuments
