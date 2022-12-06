import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import Header from "^components/header"
import { $Container_ } from "../_presentation/article-like"
import { Date_ } from "../_containers/article-like"
import { Authors_, Languages_ } from "../_containers"
import Body from "./Body"

import { $Header, $Title, $authors } from "../_styles/article-like"

const PageContent = ({ article, childEntities, header }: StaticData) => {
  const { documentLanguage, setDocumentLanguage } =
    useDetermineDocumentLanguage(childEntities.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = article.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <div>
      <Header {...header} />
      <$Container_>
        <$Header>
          <Languages_
            documentLanguage={documentLanguage}
            documentLanguages={childEntities.languages}
            setDocumentLanguage={setDocumentLanguage}
          />
          <Date_ date={article.publishDate} />
          <$Title>{translation.title}</$Title>
          <Authors_
            authors={childEntities.authors}
            documentLanguage={documentLanguage}
            styles={$authors}
          />
        </$Header>
        <Body body={translation.body} images={childEntities.images} />
      </$Container_>
    </div>
  )
}

export default PageContent
