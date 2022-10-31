import { useState } from 'react'

import { StaticData } from './staticData'

import { SelectTranslation, Authors_, Text_ } from '../_containers'
import { $Container_ } from '../_presentation/article-like'
import { Date_ } from '../_containers/article-like'
import { $Header, $Title, $authors } from '../_styles/article-like'
import { ArticleLikeTextSection } from '^types/article-like-entity'

// Todo: `article` data can be stripped of fields since e.g. languages, authors, are fetched from it

const PageContent = ({
  article,
  languages: articleLanguages,
  authors: articleAuthors,
}: StaticData) => {
  const [selectedLanguage, setSelectedLanguage] = useState(articleLanguages[0])

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const selectedTranslation = article.translations.find(
    (t) => t.languageId === selectedLanguage.id
  )!

  const textsection = selectedTranslation.body.find(
    (s) => s.type === 'text'
  ) as ArticleLikeTextSection
  const text = textsection.text!

  return (
    <div>
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
        <Text_ text={text} />
      </$Container_>
    </div>
  )
}

export default PageContent
