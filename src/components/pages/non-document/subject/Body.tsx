import tw from "twin.macro"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { Language } from "^types/entities"
import ArticleLikeEntity from "./child-summaries/ArticleLike"
import RecordedEvent from "./child-summaries/RecordedEvent"

import { StaticData } from "./staticData"

const $ChildSummaryContainer = tw.div`p-sm`

const DocumentBody = ({
  documentLanguage,
  childDocumentEntities,
}: {
  documentLanguage: Language
  childDocumentEntities: StaticData["subject"]["childDocumentEntities"]
}) => {
  return (
    <div css={[tw`grid grid-cols-12 lg:grid-rows-2 border-l border-r mx-md`]}>
      {childDocumentEntities.first.map((entity, i) => (
        <$ChildSummaryContainer
          css={[
            i === 0 && tw`col-span-12 lg:row-span-2 lg:col-span-6 lg:border-r`,
            (i === 1 || i === 3) && tw`border-r`,
            i !== 0 && tw`min-h-[370px] col-span-6 lg:col-span-3`,
            tw`border-b`,
          ]}
          key={entity.id}
        >
          {entity.type === "article" || entity.type === "blog" ? (
            <ArticleLikeEntity
              articleLikeEntity={entity}
              parentCurrentLanguageId={documentLanguage.id}
              isFirst={i === 0}
            />
          ) : (
            <RecordedEvent
              parentCurrentLanguageId={documentLanguage.id}
              recordedEvent={entity as RecordedEventAsSummary}
            />
          )}
        </$ChildSummaryContainer>
      ))}
      {childDocumentEntities.second.map((entity, i) => (
        <$ChildSummaryContainer
          css={[
            tw`col-span-6 lg:col-span-4 border-b`,
            (i + 1) % 3 !== 0 && tw`border-r`,
          ]}
          key={entity.id}
        >
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

export default DocumentBody
