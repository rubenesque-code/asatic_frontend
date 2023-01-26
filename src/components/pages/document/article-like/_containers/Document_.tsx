import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { StaticData } from "../_types"

import { Languages_ } from "^components/pages/_containers"
import { Authors_ } from "../../_containers"
import { DocumentBody_ } from "./DocumentBody_"

import { $DocumentHeader, $Title, $authors, $Date } from "../_styles"
import tw from "twin.macro"

export const Document_ = ({
  pageData: { articleLikeEntity: article, authors, languages },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { documentLanguage } = useDetermineDocumentLanguage(languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = article.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <>
      <$DocumentHeader>
        <div css={[tw`mb-sm sm:mb-md`]}>
          <Languages_
            documentLanguage={documentLanguage}
            documentLanguages={languages}
          />
        </div>
        <$Date>{article.publishDate}</$Date>
        <$Title>{translation.title}</$Title>
        <Authors_
          authors={authors}
          documentLanguageId={documentLanguage.id}
          styles={$authors}
        />
      </$DocumentHeader>
      <DocumentBody_ body={translation.body} />
    </>
  )
}
