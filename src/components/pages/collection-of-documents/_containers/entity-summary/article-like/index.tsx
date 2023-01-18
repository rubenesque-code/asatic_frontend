import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"

import { Authors_, DateString_ } from "^components/pages/_containers"
import { $link } from "^styles/global"

import { $SummaryImage, $SummaryText } from "^entity-summary/_presentation"
import { EntityLink_ } from "^entity-summary/_containers"

const $authors = tw`flex gap-xs text-lg text-gray-600 mb-xxs`

// TODO: max characthers

export const ArticleLikeSummaryDefault = ({
  articleLikeEntity,
  parentCurrentLanguageId,
  useImage,
  isSmall,
}: {
  articleLikeEntity: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
  useImage: boolean
  isSmall: boolean
}) => {
  const translation = determineChildTranslation(
    articleLikeEntity.translations,
    parentCurrentLanguageId
  )

  const isImage = useImage && articleLikeEntity.summaryImage
  const imageCharsEquivalent = !isImage ? 0 : 400 // image will only show when colSpan = 2.

  const titleCharsEquivalentForColSpan2 =
    !translation.title?.length || translation.title.length < 30
      ? 120
      : (translation.title.length / 30) * 60
  const titleCharsEquivalent = !isSmall
    ? titleCharsEquivalentForColSpan2
    : titleCharsEquivalentForColSpan2 / 2

  const authorsCharsEquivalent = !articleLikeEntity.authors.length
    ? 0
    : !isSmall
    ? 140
    : 70

  const baseChars = !isSmall ? 700 : 350

  const maxCharsCalculated =
    baseChars -
    imageCharsEquivalent -
    titleCharsEquivalent -
    authorsCharsEquivalent

  const maxCharacters = maxCharsCalculated > 100 ? maxCharsCalculated : 100

  return (
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>
      {useImage ? (
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
        maxCharacters={maxCharacters}
      />
    </div>
  )
}
