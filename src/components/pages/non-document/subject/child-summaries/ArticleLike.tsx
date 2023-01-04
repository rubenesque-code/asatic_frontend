import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"

import { Authors_ } from "^components/pages/_containers"
import {
  SummaryImage,
  SummaryText,
} from "^components/pages/_collections/DocumentSummary"

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

  const maxBodyCharacters = isFirst ? 800 : 200

  return (
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>
      {isFirst ? (
        <SummaryImage
          image={articleLikeEntity.summaryImage}
          styles={tw`mb-xs`}
        />
      ) : null}
      <h3 css={[tw`text-xl mb-xxs`]}>{translation.title}</h3>
      <Authors_
        authors={articleLikeEntity.authors}
        parentLanguageId={translation.languageId}
        styles={$authors}
      />
      <p
        css={[
          tw`mb-xs text-gray-800 font-sans-document font-light text-sm tracking-wider`,
        ]}
      >
        {articleLikeEntity.publishDate}
      </p>
      <SummaryText
        htmlStr={translation.summaryText}
        languageId={translation.languageId}
        maxCharacters={maxBodyCharacters}
      />
    </div>
  )
}

export default ArticleLikeEntity
