import { useState } from 'react'

import { StaticData } from './staticData'

import Body from './Body'
import { SelectTranslation, Authors_ } from '../_containers'
import { $Container_ } from '../_presentation/article-like'
import { Date_ } from '../_containers/article-like'
import { $Header, $Title, $authors } from '../_styles/article-like'

// Todo: `article` data can be stripped of fields since e.g. languages, authors, are fetched from it

const PageContent = ({
  article,
  languages: articleLanguages,
  authors: articleAuthors,
  images: articleImages,
}: StaticData) => {
  const [selectedLanguage, setSelectedLanguage] = useState(articleLanguages[0])

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const selectedTranslation = article.translations.find(
    (t) => t.languageId === selectedLanguage.id
  )!

  return (
    <$Container_>
      <$Header>
        <SelectTranslation
          documentLanguages={articleLanguages}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <Date_ date={article.publishDate} />
        <$Title>{selectedTranslation.title}</$Title>
        <Authors_
          authors={articleAuthors}
          selectedLanguage={selectedLanguage}
          styles={$authors}
        />
      </$Header>
      <Body body={selectedTranslation.body} images={articleImages} />
    </$Container_>
  )
}

export default PageContent
