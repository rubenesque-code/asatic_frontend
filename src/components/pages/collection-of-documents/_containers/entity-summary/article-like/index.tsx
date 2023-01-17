import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"

import { Authors_, DateString_ } from "^components/pages/_containers"
import { $link } from "^styles/global"

import { $SummaryImage, $SummaryText } from "^entity-summary/_presentation"
import { EntityLink_ } from "^entity-summary/_containers"

const $authors = tw`flex gap-xs text-lg text-gray-600 mb-xxs`

export const ArticleLikeSummaryDefault = ({
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
        <$SummaryImage
          image={articleLikeEntity.summaryImage}
          styles={tw`mb-xs`}
        />
      ) : null}
      <EntityLink_
        entityId={articleLikeEntity.id}
        documentLanguageId={translation.languageId}
        routeKey={articleLikeEntity.type === "article" ? "articles" : "blogs"}
      >
        <h3 css={[tw`text-xl mb-xxs cursor-pointer`, $link]}>
          {translation.title}
        </h3>
      </EntityLink_>
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
        <DateString_
          engDateStr={articleLikeEntity.publishDate}
          languageId={translation.languageId}
        />
      </p>
      <$SummaryText
        htmlStr={translation.summaryText}
        languageId={translation.languageId}
        maxCharacters={maxBodyCharacters}
      />
    </div>
  )
}
