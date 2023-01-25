import tw from "twin.macro"

import { StaticData } from "./staticData"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { findTranslationByLanguageId } from "^helpers/data"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { ArticleLikeSummaryDefault } from "^entity-summary/article-like"

const ArticlesPageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <PageBody pageData={pageData} />
    </PageLayout_>
  )
}

export default ArticlesPageContent

const PageBody = ({
  pageData: { articleLikeEntities: articles, languages },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  const articlesProcessed = sortEntitiesByDate(
    articles.filter((article) =>
      findTranslationByLanguageId(article.translations, filterLanguage.id)
    )
  )

  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
          <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
            {siteTranslations.articles[siteLanguage.id]}
          </h1>
          <div css={[tw`pt-sm`]}>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={languages}
            />
          </div>
        </$SectionContent>
      </div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`grid grid-cols-1 sm:grid-cols-2`]}>
          {articlesProcessed.map((article, i) => {
            return (
              <$SummaryContainer
                css={[
                  i % 2 === 0 ? tw`sm:border-r` : tw`border-r-0`,
                  i < articlesProcessed.length ? tw`border-b` : tw`border-b-0`,
                  articlesProcessed.length % 2 === 0
                    ? i < articlesProcessed.length - 2
                      ? tw`sm:border-b`
                      : tw`sm:border-b-0`
                    : articlesProcessed.length % 2 === 1 &&
                      i < articlesProcessed.length - 1
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
      </div>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`
