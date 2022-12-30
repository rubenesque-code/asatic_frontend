import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { $BodyContainer_ } from "^page-presentation"
import { Languages_ } from "^page-container"
import { Date_ } from "../_containers/article-like"
import { $Header, $Title, $authors } from "../_styles/article-like"
import { Authors_ } from "../_containers"
import Body from "./Body"
import Header from "^components/header"

// article has been processed so only valid translations and child entities remain; invalid translations and child entities have been removed.
// ...any child entity id of `article`, e.g. article.authorsIds[number], is within `childEntities`

const PageContent = ({ article, header }: StaticData) => {
  const { documentLanguage, setDocumentLanguage } =
    useDetermineDocumentLanguage(article.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = article.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <div>
      <Header {...header} />
      <$BodyContainer_>
        <$Header>
          {/*           <Languages_
            documentLanguage={documentLanguage}
            documentLanguages={childEntities.languages}
            setDocumentLanguage={setDocumentLanguage}
          /> */}
          <Date_ date={article.publishDate} />
          <$Title>{translation.title}</$Title>
          <Authors_
            authors={article.authors}
            documentLanguage={documentLanguage}
            styles={$authors}
          />
        </$Header>
        {/* <Body body={translation.body} images={childEntities.images} /> */}
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
