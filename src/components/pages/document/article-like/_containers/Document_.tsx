import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { Languages_ } from "^page-container"
// import {  } from "module";
import { $DocumentHeader, $Title, $authors, $Date } from "../_styles"
import { Authors_ } from "../../_containers"
import DocumentBody_ from "./DocumentBody_"
import { StaticData } from "../_types"

// article has been processed so only valid translations and child entities remain; invalid translations and child entities have been removed.
// ...any child entity id of `article`, e.g. article.authorsIds[number], is within `childEntities`

export const Document_ = (article: StaticData["entity"]) => {
  const { documentLanguage, setDocumentLanguage } =
    useDetermineDocumentLanguage(article.languages)

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
          setDocumentLanguage={setDocumentLanguage}
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
