/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"
import { determineChildTranslation } from "^helpers/document"
import { StaticData } from "../staticData"

import {
  $ChildSummaryContainer,
  SummaryImage,
  SummaryText,
} from "^components/pages/_collections/DocumentSummary"

const Collection = ({
  collection,
  parentCurrentLanguageId,
  index,
}: {
  collection: StaticData["subject"]["collections"][number]
  parentCurrentLanguageId: string
  index: number
}) => {
  const translation = determineChildTranslation(
    collection.translations,
    parentCurrentLanguageId
  )

  return (
    <$ChildSummaryContainer css={[index !== 0 && tw`border-l`]}>
      <div css={[tw`max-w-full max-h-full flex flex-col`]}>
        <SummaryImage image={collection.summaryImage!} styles={tw`mb-xs`} />
        <h3 css={[tw`text-xl mb-xxs`]}>{translation.title}</h3>
        <SummaryText
          htmlStr={translation.summaryText!}
          languageId={translation.languageId}
          maxCharacters={200}
        />
      </div>
    </$ChildSummaryContainer>
  )
}

export default Collection
