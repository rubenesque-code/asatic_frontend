import tw from "twin.macro"
import { Language } from "^types/entities"
import Article from "./child-summaries/article"

import { StaticData } from "./staticData"

const $ChildSummaryContainer = tw.div`p-xs`

const DocumentBody = ({
  documentLanguage,
  childDocumentEntities,
}: {
  documentLanguage: Language
  childDocumentEntities: StaticData["subject"]["childDocumentEntities"]
}) => {
  return (
    <div css={[tw`grid grid-cols-4 grid-rows-2 border-l border-r mx-md`]}>
      {childDocumentEntities.first.map((entity, i) => (
        <$ChildSummaryContainer
          css={[
            i === 0 && tw`col-span-2 row-span-2 border-r h-[600px]`,
            (i === 1 || i === 3) && tw`border-r`,
            i !== 0 && tw`max-h-[300px]`,
            tw`border-b`,
          ]}
          key={entity.id}
        >
          {entity.type === "article" ? (
            <Article
              article={entity}
              parentCurrentLanguageId={documentLanguage.id}
            />
          ) : (
            <div>Not Article</div>
          )}
        </$ChildSummaryContainer>
      ))}
    </div>
  )
}

export default DocumentBody
