import tw from "twin.macro"

import HtmlStrToJSX from "^components/HtmlStrToJSX"
import {
  defaultSiteLanguageId,
  secondDefaultSiteLanguageId,
} from "^constants/languages"
import { findEntityByLanguageId } from "^helpers/data"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { Authors_ } from "^components/pages/_containers"
import StorageImage from "^components/StorageImage"

export const $authors = tw`flex gap-xs text-lg text-gray-600 mb-xxs`

const Article = ({
  article,
  parentCurrentLanguageId,
  showImage = false,
}: {
  article: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
  showImage?: boolean
}) => {
  const translation =
    findEntityByLanguageId(article.translations, parentCurrentLanguageId) ||
    findEntityByLanguageId(article.translations, defaultSiteLanguageId) ||
    findEntityByLanguageId(article.translations, secondDefaultSiteLanguageId) ||
    article.translations[0]

  return (
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>
      {showImage ? <SummaryImage image={article.summaryImage} /> : null}
      <h3 css={[tw`text-xl mb-xxs`]}>{translation.title}</h3>
      <Authors_
        authors={article.authors}
        documentLanguageId={parentCurrentLanguageId}
        styles={$authors}
      />
      <p
        css={[
          tw`mb-xs text-gray-800 font-sans-document font-light text-sm tracking-wider`,
        ]}
      >
        {article.publishDate}
      </p>
      <div
        css={[tw`overflow-hidden border flex-shrink`]}
        className="custom-prose"
        style={{
          width: "auto",
        }}
      >
        <HtmlStrToJSX text={translation.summaryText} flattenContent />
      </div>
    </div>
  )
}

export default Article

const SummaryImage = ({
  image,
}: {
  image: ArticleLikeEntityAsSummary["summaryImage"]
}) => {
  if (!image) {
    return null
  }

  return (
    <div
      css={[
        tw`relative aspect-ratio[16 / 9] w-full border border-red-600 mb-xs flex-grow`,
      ]}
    >
      {/*       <StorageImage
        image={image.storageImage}
        vertPosition={image.vertPosition}
      /> */}
    </div>
  )
}
