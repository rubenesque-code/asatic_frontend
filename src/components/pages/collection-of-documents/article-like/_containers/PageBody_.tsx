import tw from "twin.macro"

import { PageData } from "../_types"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { siteTranslations } from "^constants/siteTranslations"

import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { findTranslationByLanguageId } from "^helpers/data"

import {
  BodyFontWrapper,
  BodyHeaderLayout_,
} from "^components/pages/_containers"
import { ArticleLikeSummaryDefault } from "^entity-summary/article-like"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { $ContentSectionLayout_ } from "^page-presentation"

export const PageBody_ = ({
  pageData: { articleLikeEntities, languages },
}: {
  pageData: PageData
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  const articleLikeEntitiesProcessed = sortEntitiesByDate(
    articleLikeEntities.filter((articleLikeEntity) =>
      findTranslationByLanguageId(
        articleLikeEntity.translations,
        filterLanguage.id
      )
    )
  )

  return (
    <>
      <BodyHeaderLayout_
        title={
          siteTranslations[
            articleLikeEntities[0].type === "article" ? "articles" : "blogs"
          ][siteLanguage.id]
        }
        languages={{
          documentLanguage: filterLanguage,
          documentLanguages: languages,
        }}
        useMargin
      />
      <BodyFontWrapper documentLanguageId={filterLanguage.id}>
        <div css={[tw`border-b`]}>
          <$ContentSectionLayout_ useMargin>
            <div css={[tw`border-l border-r grid grid-cols-1 sm:grid-cols-2`]}>
              {articleLikeEntitiesProcessed.map((article, i) => {
                return (
                  <$SummaryContainer
                    css={[
                      i % 2 === 0 ? tw`sm:border-r` : tw`border-r-0`,
                      i < articleLikeEntitiesProcessed.length - 1
                        ? tw`border-b`
                        : tw`border-b-0`,
                      articleLikeEntitiesProcessed.length % 2 === 0
                        ? i < articleLikeEntitiesProcessed.length - 2
                          ? tw`sm:border-b`
                          : tw`sm:border-b-0`
                        : articleLikeEntitiesProcessed.length % 2 === 1 &&
                          i < articleLikeEntitiesProcessed.length - 1
                        ? tw`sm:border-b`
                        : tw`sm:border-b-0`,
                    ]}
                    key={article.id}
                  >
                    <ArticleLikeSummaryDefault
                      articleLikeEntity={article}
                      isSmall={false}
                      parentCurrentLanguageId={filterLanguage.id}
                      useImage={true}
                    />
                  </$SummaryContainer>
                )
              })}
            </div>
          </$ContentSectionLayout_>
        </div>
      </BodyFontWrapper>
    </>
  )
}
