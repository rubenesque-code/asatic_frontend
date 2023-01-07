import tw from "twin.macro"

import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { Language } from "^types/entities"
import { StaticData } from "./staticData"

import ArticleLikeEntity from "./child-summaries/ArticleLike"
import RecordedEvent from "./child-summaries/RecordedEvent"
import Collections from "./Collections"
import { $ChildSummaryContainer } from "^components/pages/_collections/DocumentSummary"
import { $SectionContent, $SectionHeader } from "./_styles"
import { useWindowSize } from "react-use"

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
  const windowSize = useWindowSize()
  return (
    <div css={[tw`pb-xl`]}>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`grid grid-cols-12 lg:grid-rows-2`]}>
          {childDocumentEntities.first.map((entity, i) => (
            <$ChildSummaryContainer
              css={[
                tw`col-span-12`,
                i === 0 && tw`lg:row-span-2 lg:col-span-6 lg:border-r`,
                i !== 0 && tw`lg:min-h-[370px] md:col-span-6 lg:col-span-3`,
                (i === 1 || i === 3) && tw`md:border-r`,
                i === 4 ? tw`border-b-0` : tw`border-b`,
                i === 3 || i === 4 ? tw`md:border-b-0` : tw`md:border-b`,
                i === 1 || i === 2 ? tw`lg:border-b` : tw`lg:border-b-0`,
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
                  tw`col-span-12 md:col-span-6 lg:col-span-4`,
                  i !== childDocumentEntities.second.length - 1
                    ? tw`border-b`
                    : tw`border-b-0`,
                  windowSize.width >= 768 &&
                  childDocumentEntities.second.length % 2 === 0
                    ? i !== childDocumentEntities.second.length - 1 &&
                      i !== childDocumentEntities.second.length - 2
                      ? tw`md:border-b`
                      : tw`md:border-b-0`
                    : i !== childDocumentEntities.second.length - 1
                    ? tw`md:border-b`
                    : tw`md:border-b-0`,
                  windowSize.width >= 1024 &&
                  childDocumentEntities.second.length % 3 === 0
                    ? i !== childDocumentEntities.second.length - 1 &&
                      i !== childDocumentEntities.second.length - 2 &&
                      i !== childDocumentEntities.second.length - 3
                      ? tw`lg:border-b`
                      : tw`lg:border-b-0`
                    : childDocumentEntities.second.length % 3 === 2
                    ? i !== childDocumentEntities.second.length - 1 &&
                      i !== childDocumentEntities.second.length - 2
                      ? tw`lg:border-b`
                      : tw`lg:border-b-0`
                    : i !== childDocumentEntities.second.length - 1
                    ? tw`lg:border-b`
                    : tw`lg:border-b-0`,
                  tw`border-r-0`,
                  i % 2 === 0 ? tw`md:border-r` : tw`md:border-r-0`,
                  (i + 1) % 3 !== 0 ? tw`lg:border-r` : tw`lg:border-r-0`,
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
