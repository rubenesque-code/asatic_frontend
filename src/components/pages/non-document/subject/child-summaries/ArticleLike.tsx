import tw from "twin.macro"

import HtmlStrToJSX from "^components/HtmlStrToJSX"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { Authors_ } from "^components/pages/_containers"
import StorageImage from "^components/StorageImage"
import { determineChildTranslation } from "^helpers/document"

export const $authors = tw`flex gap-xs text-lg text-gray-600 mb-xxs`

const ArticleLikeEntity = ({
  articleLikeEntity,
  parentCurrentLanguageId,
  isFirst,
}: {
  articleLikeEntity: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
  isFirst?: boolean
}) => {
  const translation = determineChildTranslation(
    articleLikeEntity.translations,
    parentCurrentLanguageId
  )

  // can do crude calculation of max chars for summary. Should then have max chars for title, authors?
  const maxBodyCharacters = isFirst ? 800 : 200

  return (
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>
      {isFirst ? <SummaryImage image={articleLikeEntity.summaryImage} /> : null}
      <h3 css={[tw`text-xl mb-xxs`]}>{translation.title}</h3>
      <Authors_
        authors={articleLikeEntity.authors}
        documentLanguageId={parentCurrentLanguageId}
        styles={$authors}
      />
      <p
        css={[
          tw`mb-xs text-gray-800 font-sans-document font-light text-sm tracking-wider`,
        ]}
      >
        {articleLikeEntity.publishDate}
      </p>
      <div
        css={[tw`overflow-hidden prose pb-sm flex-shrink`]}
        className="custom-prose"
        style={{
          width: "auto",
          maxWidth: "100%",
        }}
      >
        <HtmlStrToJSX
          htmlStr={translation.summaryText}
          flattenContent={{ numChars: maxBodyCharacters }}
        />
      </div>
    </div>
  )
}

export default ArticleLikeEntity

const SummaryImage = ({
  image,
}: {
  image: ArticleLikeEntityAsSummary["summaryImage"]
}) => {
  if (!image) {
    return null
  }

  return (
    <div css={[tw`relative aspect-ratio[16 / 9] w-full mb-xs flex-grow`]}>
      <StorageImage
        image={image.storageImage}
        vertPosition={image.vertPosition}
      />
    </div>
  )
}
