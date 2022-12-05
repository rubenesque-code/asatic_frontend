import tw from "twin.macro"

import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { $Container_ } from "../_presentation/article-like"
import { Date_ } from "../_containers/article-like"
import { $Header, $Title, $authors } from "../_styles/article-like"
import { Authors_ } from "../_containers"

// Todo: `article` data can be stripped of fields since e.g. languages, authors, are fetched from it

// article has been processed so only valid translations and child entities remain; invalid translations and child entities have been removed.
// ...any child entity id of `article`, e.g. article.authorsIds[number], is within `childEntities`

const PageContent = ({ article, childEntities }: StaticData) => {
  const { documentLanguage, setDocumentLanguage } =
    useDetermineDocumentLanguage(childEntities.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = article.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <$Container_>
      <$Header>
        <div css={[tw`flex items-center gap-sm mb-md`]}>
          {childEntities.languages.map((language) => (
            <div key={language.id}>
              <button
                onClick={() => setDocumentLanguage(language)}
                type="button"
              >
                {language.name}
              </button>
            </div>
          ))}
        </div>
        <Date_ date={article.publishDate} />
        <$Title>{translation.title}</$Title>
        {JSON.stringify(article)}
        <Authors_
          authors={childEntities.authors}
          documentLanguage={documentLanguage}
          styles={$authors}
        />
      </$Header>
      {/* <Body body={selectedTranslation.body} images={articleImages} /> */}
    </$Container_>
  )
}

export default PageContent
