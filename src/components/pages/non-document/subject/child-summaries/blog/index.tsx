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

const Blog = ({
  blog,
  parentCurrentLanguageId,
  showImage = false,
}: {
  blog: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
  showImage?: boolean
}) => {
  const translation =
    findEntityByLanguageId(blog.translations, parentCurrentLanguageId) ||
    findEntityByLanguageId(blog.translations, defaultSiteLanguageId) ||
    findEntityByLanguageId(blog.translations, secondDefaultSiteLanguageId) ||
    blog.translations[0]

  return (
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>
      {showImage ? <SummaryImage image={blog.summaryImage} /> : null}
      <h3 css={[tw`text-xl mb-xxs`]}>{translation.title}</h3>
      <Authors_
        authors={blog.authors}
        documentLanguageId={parentCurrentLanguageId}
        styles={$authors}
      />
      <p
        css={[
          tw`mb-xs text-gray-800 font-sans-document font-light text-sm tracking-wider`,
        ]}
      >
        {blog.publishDate}
      </p>
      <div
        css={[tw`flex-grow  overflow-hidden`]}
        className="custom-prose"
        style={{
          width: "auto",
        }}
      >
        <HtmlStrToJSX text={translation.summaryText} />
      </div>
    </div>
  )
}

export default Blog

const SummaryImage = ({
  image,
}: {
  image: ArticleLikeEntityAsSummary["summaryImage"]
}) => {
  if (!image) {
    return null
  }

  return (
    <div css={[tw`relative aspect-ratio[16 / 9]`]}>
      <StorageImage
        image={image.storageImage}
        vertPosition={image.vertPosition}
      />
    </div>
  )
}
