import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageWrapper_ } from "^components/pages/_containers"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { ArticleLikeSummaryDefault } from "^entity-summary/article-like"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { findTranslationByLanguageId } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"

const BlogsPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.blogs[siteLanguage.id]}
    >
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default BlogsPageContent

const PageBody = ({
  pageData: { articleLikeEntities: blogs, languages },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  const blogsProcessed = sortEntitiesByDate(
    blogs.filter((blog) =>
      findTranslationByLanguageId(blog.translations, filterLanguage.id)
    )
  )

  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
          <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
            {siteTranslations.blogs[siteLanguage.id]}
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
          {blogsProcessed.map((blog, i) => {
            return (
              <$SummaryContainer
                css={[
                  i % 2 === 0 ? tw`sm:border-r` : tw`border-r-0`,
                  i < blogsProcessed.length ? tw`border-b` : tw`border-b-0`,
                  blogsProcessed.length % 2 === 0
                    ? i < blogsProcessed.length - 2
                      ? tw`sm:border-b`
                      : tw`sm:border-b-0`
                    : blogsProcessed.length % 2 === 1 &&
                      i < blogsProcessed.length - 1
                    ? tw`sm:border-b`
                    : tw`sm:border-b-0`,
                ]}
                key={blog.id}
              >
                <ArticleLikeSummaryDefault
                  articleLikeEntity={blog}
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
