import tw from "twin.macro"

import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { Language } from "^types/entities"
import { StaticData } from "./staticData"

import ArticleLikeEntity from "./child-summaries/ArticleLike"
import RecordedEvent from "./child-summaries/RecordedEvent"
import Collections from "./Collections"
import { $ChildSummaryContainer } from "^components/pages/_collections/DocumentSummary"
import { $SectionContent, $SectionHeader } from "./_styles"

const DocumentBody = ({
  documentLanguage,
  childDocumentEntities,
  collections,
  subjectTitle,
}: {
  documentLanguage: Language
  childDocumentEntities: StaticData["subject"]["childDocumentEntities"]
  collections: StaticData["subject"]["collections"]
  subjectTitle: string
}) => {
  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`grid grid-cols-12 lg:grid-rows-2`]}>
          {childDocumentEntities.first.map((entity, i) => (
            <$ChildSummaryContainer
              css={[
                i === 0 &&
                  tw`col-span-12 lg:row-span-2 lg:col-span-6 lg:border-r`,
                (i === 1 || i === 3) && tw`border-r`,
                i !== 0 && tw`lg:min-h-[370px] col-span-6 lg:col-span-3`,
                // (i === 1 || i === 2) && tw`lg:border-b`,
                (i === 0 || i === 1 || i === 2) && tw`border-b`,
                i === 0 && tw`lg:border-b-0`,
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
        </$SectionContent>
      </div>
      <Collections
        collections={collections}
        parentCurrentLanguageId={documentLanguage.id}
      />
      {childDocumentEntities.second.length ? (
        <div css={[tw`border-b`]}>
          <$SectionHeader>More from {subjectTitle}</$SectionHeader>
          <$SectionContent css={[tw`grid grid-cols-12`]}>
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
          </$SectionContent>
        </div>
      ) : null}
    </div>
  )
}

export default DocumentBody
