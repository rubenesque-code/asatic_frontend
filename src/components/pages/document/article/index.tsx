import { useState } from "react"

import { StaticData } from "./staticData"

import Body from "./Body"
import { SelectTranslation, Authors_ } from "../_containers"
import { $Container_ } from "../_presentation/article-like"
import { Date_ } from "../_containers/article-like"
import { $Header, $Title, $authors } from "../_styles/article-like"

// Todo: `article` data can be stripped of fields since e.g. languages, authors, are fetched from it

// article has been processed so only valid translations and child entities remain; invalid translations and child entities have been removed.
// ...any child entity id of `article`, e.g. article.authorsIds[number], is within `childEntities`

const PageContent = ({ article, childEntities }: StaticData) => {
  // todo: pick translation
  return (
    <$Container_>
      <$Header>
        {/*         <SelectTranslation
          documentLanguages={article.subEntities.languages}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        /> */}
        {/* <Date_ date={article.data.publishDate} /> */}
        {/* <$Title>{selectedTranslation.title}</$Title> */}
        {JSON.stringify(article)}
        {/*         <Authors_
          authors={articleAuthors}
          selectedLanguage={selectedLanguage}
          styles={$authors}
        /> */}
      </$Header>
      {/* <Body body={selectedTranslation.body} images={articleImages} /> */}
    </$Container_>
  )
}

export default PageContent
