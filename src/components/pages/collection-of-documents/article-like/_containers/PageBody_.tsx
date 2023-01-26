import tw from "twin.macro"

import { PageData } from "../_types"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { siteTranslations } from "^constants/siteTranslations"

import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { findTranslationByLanguageId } from "^helpers/data"

import { Languages_ } from "^components/pages/_containers"
import { ArticleLikeSummaryDefault } from "^entity-summary/article-like"
import { $ContentSectionMaxWidthWrapper } from "^components/pages/_presentation"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"

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
    <div>
      <div css={[tw`border-b`]}>
        <$ContentSectionMaxWidthWrapper>
          <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
            <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
              {siteTranslations.articles[siteLanguage.id]}
            </h1>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={languages}
              styles={tw`pt-md`}
            />
          </$SectionContent>
        </$ContentSectionMaxWidthWrapper>
      </div>
      <div css={[tw`border-b`]}>
        <$ContentSectionMaxWidthWrapper>
          <$SectionContent css={[tw`grid grid-cols-1 sm:grid-cols-2`]}>
            {articleLikeEntitiesProcessed.map((article, i) => {
              return (
                <$SummaryContainer
                  css={[
                    i % 2 === 0 ? tw`sm:border-r` : tw`border-r-0`,
                    i < articleLikeEntitiesProcessed.length
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
          </$SectionContent>
        </$ContentSectionMaxWidthWrapper>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`
