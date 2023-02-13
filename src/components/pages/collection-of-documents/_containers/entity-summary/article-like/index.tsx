import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"

import { Authors_, DateString_ } from "^components/pages/_containers"

import { $SummaryImage, $SummaryText } from "^entity-summary/_presentation"
import { EntityLink_ } from "^entity-summary/_containers"

import {
  $Title,
  $authors,
  $Date,
  $image,
} from "^entity-summary/_styles/$summary"
import { useGlobalDataContext } from "^context/GlobalData"

export const ArticleLikeSummaryDefault = ({
  articleLikeEntity,
  parentCurrentLanguageId,
  useImage,
  isSmall,
  isDouble,
  imagePriority,
}: {
  articleLikeEntity: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
  useImage: boolean
  isSmall: boolean
  isDouble?: boolean
  imagePriority?: boolean
}) => {
  const globalData = useGlobalDataContext()

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

  const baseChars = isDouble ? 1400 : !isSmall ? 700 : 300

  const maxCharsCalculated =
    baseChars -
    imageCharsEquivalent -
    titleCharsEquivalent -
    authorsCharsEquivalent

  const maxCharacters = maxCharsCalculated > 100 ? maxCharsCalculated : 100

  return (
    <div
      css={[
        tw`max-w-full max-h-full flex flex-col`,
        parentCurrentLanguageId === "tamil"
          ? tw`font-serif-primary-tamil`
          : tw`font-serif-primary`,
      ]}
    >
      {useImage ? (
        <$SummaryImage
          image={articleLikeEntity.summaryImage}
          styles={$image}
          imagePriority={imagePriority}
        />
      ) : null}
      <EntityLink_
        entityId={articleLikeEntity.id}
        documentLanguageId={translation.languageId}
        routeKey={articleLikeEntity.type === "article" ? "articles" : "blogs"}
      >
        <$Title>{translation.title}</$Title>
      </EntityLink_>
      {globalData.isMultipleAuthors ? (
        <Authors_
          authors={articleLikeEntity.authors}
          parentLanguageId={translation.languageId}
          styles={$authors}
        />
      ) : null}
      <$Date languageId={parentCurrentLanguageId}>
        <DateString_
          engDateStr={articleLikeEntity.publishDate}
          languageId={translation.languageId}
        />
      </$Date>
      <$SummaryText
        htmlStr={translation.summaryText}
        languageId={translation.languageId}
        maxCharacters={maxCharacters}
        overflowHidden
      />
    </div>
  )
}
