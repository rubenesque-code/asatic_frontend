import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { Languages_ } from "^page-container"
import { $DocumentHeader, $Title, $authors, $Date } from "../_styles"
import { Authors_ } from "../../_containers"
import DocumentBody_ from "./DocumentBody_"
import { StaticData } from "../_types"

export const Document_ = (article: StaticData["entity"]) => {
  const { documentLanguage } = useDetermineDocumentLanguage(article.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = article.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <>
      <$DocumentHeader>
        <Languages_
          documentLanguage={documentLanguage}
          documentLanguages={article.languages}
        />
        <$Date>{article.publishDate}</$Date>
        <$Title>{translation.title}</$Title>
        <Authors_
          authors={article.authors}
          documentLanguage={documentLanguage}
          styles={$authors}
        />
      </$DocumentHeader>
      <DocumentBody_ body={translation.body} />
    </>
  )
}
