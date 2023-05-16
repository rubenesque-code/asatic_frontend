import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"

import { Authors_, DateString_ } from "^components/my-pages/_containers"
import { EntityLink_ } from "^entity-summary/_containers"
import { $SummaryImage, $SummaryText } from "^entity-summary/_presentation"
import { $Title, $authors, $Date } from "^entity-summary/_styles/$summary"
import { $ImageContainer } from "../_styles"
import { useGlobalDataContext } from "^context/GlobalData"

const ArticleLikeEntity = ({
  articleLikeEntity,
  parentCurrentLanguageId,
}: {
  articleLikeEntity: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
}) => {
  const globalData = useGlobalDataContext()

  const translation = determineChildTranslation(
    articleLikeEntity.translations,
    parentCurrentLanguageId
  )

  const maxBodyCharacters = articleLikeEntity.summaryImage ? 200 : 300

  return (
    <div css={[tw`w-full min-h-[180px]`]}>
      {articleLikeEntity.summaryImage ? (
        <$ImageContainer css={[tw`sm:float-left sm:pr-sm box-content`]}>
          <$SummaryImage
            image={articleLikeEntity.summaryImage}
            styles={tw`mb-xs sm:mb-0`}
          />
        </$ImageContainer>
      ) : null}
      <div>
        <EntityLink_
          documentLanguageId={translation.languageId}
          entityId={articleLikeEntity.id}
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
          maxCharacters={maxBodyCharacters}
          overflowHidden={false}
        />
      </div>
    </div>
  )
}

export default ArticleLikeEntity
