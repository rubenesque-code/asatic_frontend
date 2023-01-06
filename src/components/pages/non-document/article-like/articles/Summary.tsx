import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"

import { SummaryText } from "^components/pages/_collections/DocumentSummary"
import { Authors_ } from "^components/pages/_containers"
import { routes } from "^constants/routes"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import { $link } from "^styles/global"
import { FilterLanguageId } from "./PageBody"

const $authors = tw`flex gap-xs text-xl text-gray-600 mt-xs`

const Summary = ({
  articleLikeEntity,
  filterLanguageId,
}: {
  articleLikeEntity: ArticleLikeEntityAsSummary
  filterLanguageId: FilterLanguageId
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const languageId = (
    filterLanguageId !== "all" ? filterLanguageId : siteLanguage.id
  ) as string

  const translation = determineChildTranslation(
    articleLikeEntity.translations,
    languageId
  )

  const maxBodyCharacters = 650

  const router = useRouter()

  const routeRoot =
    articleLikeEntity.type === "article" ? routes.articles : routes.blogs
  const pathname = `${routeRoot}/${articleLikeEntity.id}`

  return (
    <div css={[tw`p-md`]}>
      <p
        css={[
          tw`mb-xs text-gray-800 font-sans-document font-light tracking-wider`,
        ]}
      >
        {articleLikeEntity.publishDate}
      </p>
      <Link
        href={{
          pathname,
          query: {
            ...router.query,
            documentLanguageId: translation.languageId,
          },
        }}
        passHref
      >
        <h3 css={[tw`text-2xl mb-xxs cursor-pointer`, $link]}>
          {translation.title}
        </h3>
      </Link>
      <Authors_
        authors={articleLikeEntity.authors}
        parentLanguageId={translation.languageId}
        styles={$authors}
      />
      <div css={[tw`mt-xs`]}>
        <SummaryText
          htmlStr={translation.summaryText}
          languageId={translation.languageId}
          maxCharacters={maxBodyCharacters}
        />
      </div>
    </div>
  )
}

export default Summary
